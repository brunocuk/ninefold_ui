// app/api/quotes/[id]/pdf/route.js
// Generate PDF from quote using Puppeteer

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getBrowser() {
  // Check if we're in production (Vercel)
  if (process.env.VERCEL) {
    // Use serverless chromium for Vercel
    const puppeteer = require('puppeteer-core');
    const chromium = require('@sparticuz/chromium');
    
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    // Use regular puppeteer for local development
    const puppeteer = require('puppeteer');
    
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Verify quote exists
    const { data: quote, error } = await supabase
      .from('quotes')
      .select('client_name, reference')
      .eq('id', id)
      .single();

    if (error || !quote) {
      return new Response('Quote not found', { status: 404 });
    }

    // Launch browser
    const browser = await getBrowser();
    const page = await browser.newPage();

    // Get the full URL to the quote preview
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const quoteUrl = `${baseUrl}/quote/${id}`;

    // Navigate to quote page
    await page.goto(quoteUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for React to render (client-side)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Generate filename
    const filename = `${quote.reference || 'quote'}.pdf`;

    // Return PDF
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(`Error generating PDF: ${error.message}`, { 
      status: 500 
    });
  }
}