// app/api/webhooks/revolut/route.js
// Revolut Webhook Handler - Receives payment events

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    console.log('');
    console.log('🔔 ===== REVOLUT WEBHOOK RECEIVED =====');
    
    // Get the raw body for signature verification
    const body = await request.text();
    const timestamp = request.headers.get('revolut-request-timestamp');
    const signature = request.headers.get('revolut-signature');

    console.log('📥 Webhook Headers:');
    console.log('- Timestamp:', timestamp);
    console.log('- Signature:', signature?.substring(0, 20) + '...');
    console.log('');

    // Verify webhook signature
    if (!verifyWebhookSignature(body, timestamp, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('✅ Signature verified');

    const event = JSON.parse(body);
    console.log('📊 Event Type:', event.event);
    console.log('📊 Order ID:', event.order_id);
    console.log('📊 Merchant Ref:', event.merchant_order_ext_ref);
    console.log('');

    // Handle different event types
    switch (event.event) {
      case 'ORDER_COMPLETED':
        await handleOrderCompleted(event);
        break;
      case 'ORDER_AUTHORISED':
        await handleOrderAuthorised(event);
        break;
      case 'ORDER_CANCELLED':
        await handleOrderCancelled(event);
        break;
      case 'ORDER_FAILED':
        await handleOrderFailed(event);
        break;
      default:
        console.log('ℹ️  Unhandled event type:', event.event);
    }

    console.log('🔔 ===== WEBHOOK PROCESSING COMPLETE =====');
    console.log('');

    return NextResponse.json({ received: true }, { status: 204 });
  } catch (error) {
    console.error('');
    console.error('🔴 ===== WEBHOOK ERROR =====');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('🔴 ===== ERROR END =====');
    console.error('');
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

function verifyWebhookSignature(body, timestamp, signature) {
  if (!signature || !timestamp || !process.env.REVOLUT_WEBHOOK_SECRET) {
    console.log('⚠️  Missing signature verification data');
    return false;
  }

  try {
    // Construct the signed payload
    const signedPayload = `${timestamp}.${body}`;
    
    // Compute HMAC SHA256 signature
    const hmac = crypto.createHmac('sha256', process.env.REVOLUT_WEBHOOK_SECRET);
    const computedSignature = hmac.update(signedPayload).digest('hex');
    
    // Compare signatures (constant-time comparison)
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

async function handleOrderCompleted(event) {
  const { order_id, merchant_order_ext_ref } = event;

  console.log('🎉 ORDER COMPLETED!');
  console.log('💰 Payment successful for order:', order_id);
  
  // Find quote by revolut_order_id
  const { data: quotes, error: fetchError } = await supabase
    .from('quotes')
    .select('*')
    .eq('revolut_order_id', order_id);

  if (fetchError || !quotes || quotes.length === 0) {
    console.error('❌ Quote not found for order:', order_id);
    console.log('ℹ️  This might be a manual payment or test order');
    return;
  }

  const quote = quotes[0];
  console.log('✅ Found quote:', quote.quote_number);

  // Update quote status
  const { error: updateError } = await supabase
    .from('quotes')
    .update({
      status: 'accepted',
      payment_received: true,
      payment_received_at: new Date().toISOString(),
      revolut_payment_state: 'COMPLETED',
    })
    .eq('id', quote.id);

  if (updateError) {
    console.error('❌ Error updating quote:', updateError);
    return;
  }

  console.log(`✅ Quote ${quote.quote_number} marked as ACCEPTED & PAID!`);
  console.log('');
  
  // TODO: Send payment confirmation email
  // await sendPaymentConfirmationEmail(quote);
}

async function handleOrderAuthorised(event) {
  const { order_id } = event;
  
  console.log('ℹ️  ORDER AUTHORISED (payment authorized but not yet captured)');
  
  // Update payment state
  await supabase
    .from('quotes')
    .update({
      revolut_payment_state: 'AUTHORISED',
    })
    .eq('revolut_order_id', order_id);

  console.log('✅ Quote payment state updated to AUTHORISED');
}

async function handleOrderCancelled(event) {
  const { order_id } = event;
  
  console.log('⚠️  ORDER CANCELLED');
  
  // Update payment state
  await supabase
    .from('quotes')
    .update({
      revolut_payment_state: 'CANCELLED',
    })
    .eq('revolut_order_id', order_id);

  console.log('✅ Quote payment state updated to CANCELLED');
}

async function handleOrderFailed(event) {
  const { order_id } = event;
  
  console.log('❌ ORDER FAILED (payment failed)');
  
  // Update payment state
  await supabase
    .from('quotes')
    .update({
      revolut_payment_state: 'FAILED',
    })
    .eq('revolut_order_id', order_id);

  console.log('✅ Quote payment state updated to FAILED');
}