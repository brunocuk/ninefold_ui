// app/api/quotes/create-payment-link-preview/route.js
// Generate Revolut payment link BEFORE quote creation (WITH DEBUGGING)

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency, clientEmail, clientName, description } = body;

    console.log('');
    console.log('🔵 ===== PAYMENT LINK GENERATION START =====');
    console.log('📊 Request Data:', {
      amount,
      currency,
      clientEmail,
      clientName,
      description: description?.substring(0, 50)
    });

    // Validation
    if (!amount || amount <= 0) {
      console.log('❌ Validation failed: Amount invalid');
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (!clientEmail) {
      console.log('❌ Validation failed: Email missing');
      return NextResponse.json(
        { error: 'Client email is required' },
        { status: 400 }
      );
    }

    if (!clientName) {
      console.log('❌ Validation failed: Name missing');
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // Generate a temporary merchant order ID
    const merchantOrderId = `PREVIEW-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    console.log('📝 Merchant Order ID:', merchantOrderId);

    // Check API key
    const apiKey = process.env.REVOLUT_MERCHANT_SECRET_KEY;
    if (!apiKey) {
      console.log('❌ REVOLUT_MERCHANT_SECRET_KEY not found in environment variables!');
      return NextResponse.json(
        { error: 'Revolut API key not configured' },
        { status: 500 }
      );
    }

    console.log('🔑 API Key found:', apiKey.substring(0, 15) + '...');

    // Determine API endpoint based on environment
    const isSandbox = apiKey.startsWith('sk_sandbox');
    const apiEndpoint = isSandbox
      ? 'https://sandbox-merchant.revolut.com/api/1.0/orders'
      : 'https://merchant.revolut.com/api/1.0/orders';

    console.log('🌐 Environment:', isSandbox ? 'SANDBOX' : 'PRODUCTION');
    console.log('🌐 API Endpoint:', apiEndpoint);

    // Prepare request body
    const requestBody = {
      amount: amount, // Already in minor units (cents)
      currency: currency || 'EUR',
      merchant_order_id: merchantOrderId,
      description: description || `Payment for ${clientName}`,
      customer_email: clientEmail,
      customer: {
        name: clientName,
        email: clientEmail,
      },
    };

    console.log('📤 Sending to Revolut:', JSON.stringify(requestBody, null, 2));

    // Create Revolut order
    console.log('⏳ Calling Revolut API...');
    const revolutResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Revolut-API-Version': process.env.REVOLUT_API_VERSION || '2024-09-01',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Revolut Response Status:', revolutResponse.status);
    console.log('📥 Revolut Response OK:', revolutResponse.ok);

    const revolutData = await revolutResponse.json();
    console.log('📥 Revolut Response Data:', JSON.stringify(revolutData, null, 2));

    if (!revolutResponse.ok) {
      console.log('❌ Revolut API Error');
      console.error('Error details:', revolutData);
      return NextResponse.json(
        { error: revolutData.message || 'Failed to create payment link' },
        { status: revolutResponse.status }
      );
    }

    console.log('✅ Payment link created successfully!');
    console.log('🔗 Checkout URL:', revolutData.checkout_url);
    console.log('🆔 Order ID:', revolutData.id);
    console.log('🔵 ===== PAYMENT LINK GENERATION END =====');
    console.log('');

    // Return the payment link details
    return NextResponse.json({
      checkout_url: revolutData.checkout_url,
      order_id: revolutData.id,
      public_id: revolutData.public_id,
      merchant_order_id: merchantOrderId,
    });

  } catch (error) {
    console.log('');
    console.log('🔴 ===== FATAL ERROR =====');
    console.error('Error creating payment link:', error);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('🔴 ===== ERROR END =====');
    console.log('');
    
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}