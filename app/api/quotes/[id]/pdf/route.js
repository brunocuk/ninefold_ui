// app/api/quotes/[id]/pdf/route.js
// Generate PDF from quote using Puppeteer

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// A4 dimensions in pixels at 96 DPI: 794 x 1123
// For print-quality PDF we use higher resolution
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

async function getBrowser() {
  // Check if we're in production (Vercel)
  if (process.env.VERCEL) {
    // Use serverless chromium for Vercel
    const puppeteer = require('puppeteer-core');
    const chromium = require('@sparticuz/chromium');

    return await puppeteer.launch({
      args: [...chromium.args, '--font-render-hinting=none'],
      defaultViewport: {
        width: A4_WIDTH,
        height: A4_HEIGHT,
        deviceScaleFactor: 2 // High quality rendering
      },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    // Use regular puppeteer for local development
    const puppeteer = require('puppeteer');

    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
      defaultViewport: {
        width: A4_WIDTH,
        height: A4_HEIGHT,
        deviceScaleFactor: 2
      }
    });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Verify quote exists
    const { data: quote, error } = await supabase
      .from('quotes')
      .select('client_name, reference, title')
      .eq('id', id)
      .single();

    if (error || !quote) {
      return new Response('Quote not found', { status: 404 });
    }

    // Launch browser
    const browser = await getBrowser();
    const page = await browser.newPage();

    // Get the full URL to the dedicated PDF template
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const quoteUrl = `${baseUrl}/quote/${id}/pdf`;

    // Navigate to quote page
    await page.goto(quoteUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for React to render and fonts to load
    await page.waitForFunction(() => document.fonts.ready);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate PDF with proper A4 settings
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px'
      },
      displayHeaderFooter: false,
      scale: 0.85 // Slightly scale down to fit content better
    });

    await browser.close();

    // Generate filename
    const safeName = (quote.title || quote.client_name || 'Ponuda')
      .replace(/[^a-zA-Z0-9\u00C0-\u017F\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    const filename = `Ponuda_${quote.reference || 'NF'}_${safeName}.pdf`;

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