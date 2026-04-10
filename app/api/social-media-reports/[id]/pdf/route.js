// app/api/social-media-reports/[id]/pdf/route.js
// Generate PDF from social media report using Puppeteer

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// A4 dimensions in pixels at 96 DPI: 794 x 1123
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

// Croatian month names
const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

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

    // Verify report exists
    const { data: report, error } = await supabase
      .from('social_media_reports')
      .select(`
        reference,
        report_month,
        report_year,
        recurring_contracts (
          name,
          clients (
            name,
            company
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error || !report) {
      return new Response('Report not found', { status: 404 });
    }

    // Launch browser
    const browser = await getBrowser();
    const page = await browser.newPage();

    // Get the full URL to the dedicated PDF template
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const reportUrl = `${baseUrl}/social-report/${id}?pdf=true`;

    // Navigate to report page
    await page.goto(reportUrl, {
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
    const clientName = (report.recurring_contracts?.clients?.company ||
      report.recurring_contracts?.clients?.name ||
      'Klijent')
      .replace(/[^a-zA-Z0-9\u00C0-\u017F\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
    const monthName = CROATIAN_MONTHS[report.report_month - 1];
    const filename = `SocialMedia_${report.reference}_${clientName}.pdf`;

    // Update status to generated if it was draft
    await supabase
      .from('social_media_reports')
      .update({ status: 'generated' })
      .eq('id', id)
      .eq('status', 'draft');

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
