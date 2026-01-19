// app/api/quotes/[id]/create-payment-link/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request, { params }) {
  try {
    const quoteId = params.id;

    // Fetch quote details
    const { data: quote, error: fetchError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (fetchError || !quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Calculate deposit based on depositRate (default to 50% for backwards compatibility)
    const total = quote.pricing?.total || 0;
    const depositRate = quote.pricing?.depositRate || 0.5;
    const depositAmount = total * depositRate;
    const depositPercent = Math.round(depositRate * 100);

    if (depositAmount <= 0) {
      return NextResponse.json(
        { error: 'Quote total must be greater than 0' },
        { status: 400 }
      );
    }

    // Create Revolut order
    const revolutResponse = await fetch('https://merchant.revolut.com/api/1.0/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REVOLUT_MERCHANT_SECRET_KEY}`,
        'Revolut-API-Version': process.env.REVOLUT_API_VERSION || '2024-09-01',
      },
      body: JSON.stringify({
        amount: Math.round(depositAmount * 100), // deposit in cents
        currency: 'EUR',
        merchant_order_id: quote.quote_number,
        description: `${depositPercent}% Deposit - ${quote.quote_number}`,
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

    // Update quote with payment link
    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        revolut_order_id: revolutData.id,
        revolut_checkout_url: revolutData.checkout_url,
        revolut_order_token: revolutData.public_id,
        revolut_payment_state: 'PENDING',
      })
      .eq('id', quoteId);

    if (updateError) {
      console.error('Error updating quote:', updateError);
      return NextResponse.json(
        { error: 'Failed to update quote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkout_url: revolutData.checkout_url,
      order_id: revolutData.id,
      public_id: revolutData.public_id,
    });

  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}