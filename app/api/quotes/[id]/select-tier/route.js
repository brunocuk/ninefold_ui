// app/api/quotes/[id]/select-tier/route.js
// Client picks a maintenance tier on the public quote page.
// Creates a Revolut order for that tier's first month and stores the choice on the quote.

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request, { params }) {
  try {
    const { id: quoteId } = await params;
    const { tierId } = await request.json();

    if (!tierId) {
      return NextResponse.json({ error: 'tierId is required' }, { status: 400 });
    }

    const { data: quote, error: fetchError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (fetchError || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const maintenance = quote.quote_data?.maintenance;
    const tier = maintenance?.tiers?.find(t => t.id === tierId);

    if (!tier || !tier.price || tier.price <= 0) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    if (quote.status === 'paid' || quote.status === 'accepted') {
      return NextResponse.json({ error: 'Quote already accepted' }, { status: 409 });
    }

    const apiKey = process.env.REVOLUT_MERCHANT_SECRET_KEY;
    const isSandbox = apiKey?.startsWith('sk_sandbox');
    const apiEndpoint = isSandbox
      ? 'https://sandbox-merchant.revolut.com/api/1.0/orders'
      : 'https://merchant.revolut.com/api/1.0/orders';

    const revolutResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Revolut-API-Version': process.env.REVOLUT_API_VERSION || '2024-09-01',
      },
      body: JSON.stringify({
        amount: Math.round(tier.price * 100),
        currency: 'EUR',
        merchant_order_id: quote.quote_number || quote.reference || quote.id,
        description: `Prvi mjesec (${tier.name}) - ${quote.client_name}`,
        customer_email: quote.client_email,
        customer: {
          name: quote.client_name,
          email: quote.client_email,
        },
      }),
    });

    const revolutData = await revolutResponse.json();

    if (!revolutResponse.ok) {
      console.error('Revolut API error:', revolutData);
      return NextResponse.json(
        { error: revolutData.message || 'Failed to create payment link' },
        { status: revolutResponse.status }
      );
    }

    // Cancel the previously created order if the client changes their pick
    const previousOrderId = quote.revolut_order_id;
    if (previousOrderId && quote.revolut_payment_state !== 'COMPLETED') {
      try {
        await fetch(`${apiEndpoint}/${previousOrderId}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Revolut-API-Version': process.env.REVOLUT_API_VERSION || '2024-09-01',
          },
        });
      } catch (cancelError) {
        console.error('Could not cancel previous order:', cancelError);
      }
    }

    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        monthly_price: tier.price,
        pricing: { monthlyPrice: tier.price, items: [], total: tier.price },
        quote_data: {
          ...quote.quote_data,
          paymentLink: revolutData.checkout_url,
          maintenance: { ...maintenance, selectedTier: tierId },
        },
        revolut_order_id: revolutData.id,
        revolut_checkout_url: revolutData.checkout_url,
        revolut_order_token: revolutData.public_id,
        revolut_payment_state: 'PENDING',
      })
      .eq('id', quoteId);

    if (updateError) {
      console.error('Error updating quote:', updateError);
      return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
    }

    return NextResponse.json({
      checkout_url: revolutData.checkout_url,
      order_id: revolutData.id,
      tier: tier.id,
    });

  } catch (error) {
    console.error('Error selecting tier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
