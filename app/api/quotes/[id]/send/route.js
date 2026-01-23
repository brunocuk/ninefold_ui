// app/api/quotes/[id]/send/route.js
// Send quote email to client via Resend

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import QuoteEmail from '@/emails/QuoteEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { recipientEmail, recipientName } = body;

    // Get quote from database
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (quoteError || !quote) {
      return Response.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Calculate valid until date (30 days from now)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    const validUntilStr = validUntil.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    // Build quote URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ninefold.eu';
    const quoteUrl = `${baseUrl}/quote/${id}`;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Bruno at NineFold <bruno@ninefold.eu>',
      to: recipientEmail,
      subject: `Ponuda za Vaš projekt - ${quote.reference}`,
      react: QuoteEmail({
        clientName: recipientName || quote.client_name,
        quoteNumber: quote.reference,
        quoteUrl: quoteUrl,
        projectOverview: quote.project_overview,
        validUntil: '30 dana',
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Update quote status to 'sent' and track email
    await supabase
      .from('quotes')
      .update({ 
        status: 'sent',
        last_sent_at: new Date().toISOString(),
        email_id: data.id,
      })
      .eq('id', id);

    return Response.json({ 
      success: true, 
      emailId: data.id,
      message: 'Quote sent successfully!' 
    });

  } catch (error) {
    console.error('Error sending quote:', error);
    return Response.json({ 
      error: error.message || 'Failed to send email' 
    }, { status: 500 });
  }
}