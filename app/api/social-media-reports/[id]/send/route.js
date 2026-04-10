// app/api/social-media-reports/[id]/send/route.js
// Send social media report email to client via Resend

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import SocialMediaReportEmail from '@/emails/SocialMediaReportEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Croatian month names
const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { recipientEmail, recipientName } = body;

    if (!recipientEmail) {
      return Response.json({ error: 'recipientEmail is required' }, { status: 400 });
    }

    // Get report from database with all related data
    const { data: report, error: reportError } = await supabase
      .from('social_media_reports')
      .select(`
        *,
        recurring_contracts (
          id,
          name,
          clients (
            id,
            name,
            company,
            email
          )
        )
      `)
      .eq('id', id)
      .single();

    if (reportError || !report) {
      return Response.json({ error: 'Report not found' }, { status: 404 });
    }

    // Build report URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ninefold.eu';
    const reportUrl = `${baseUrl}/social-report/${id}`;
    const pdfUrl = `${baseUrl}/api/social-media-reports/${id}/pdf`;

    // Format period for display
    const monthName = CROATIAN_MONTHS[report.report_month - 1];
    const periodDisplay = `${monthName} ${report.report_year}`;

    // Get client info
    const clientName = recipientName ||
      report.recurring_contracts?.clients?.company ||
      report.recurring_contracts?.clients?.name ||
      'Cijenjeni klijente';

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Bruno at NineFold <bruno@ninefold.eu>',
      to: recipientEmail,
      subject: `Mjesečni izvještaj društvenih mreža - ${periodDisplay} | ${report.reference}`,
      react: SocialMediaReportEmail({
        clientName,
        reportReference: report.reference,
        reportUrl,
        pdfUrl,
        periodDisplay,
        platforms: report.platforms || {},
        contentDelivered: report.content_delivered || {},
        contentPlanned: report.content_planned || {},
        postsPublished: report.posts_published || 0,
        totalReach: report.total_reach || 0,
        totalEngagement: report.total_engagement || 0,
        followerGrowth: report.follower_growth || 0,
        avgEngagementRate: report.avg_engagement_rate,
        topPosts: report.top_posts || [],
        paidAdsEnabled: report.paid_ads_enabled,
        paidAdsSpend: report.paid_ads_spend,
        paidAdsImpressions: report.paid_ads_impressions,
        paidAdsClicks: report.paid_ads_clicks,
        highlights: report.highlights || [],
        recommendations: report.recommendations || [],
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Update report status to 'sent' and track email
    await supabase
      .from('social_media_reports')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_to: recipientEmail,
        email_id: data.id,
      })
      .eq('id', id);

    return Response.json({
      success: true,
      emailId: data.id,
      message: 'Izvještaj uspješno poslan!'
    });

  } catch (error) {
    console.error('Error sending report:', error);
    return Response.json({
      error: error.message || 'Failed to send email'
    }, { status: 500 });
  }
}
