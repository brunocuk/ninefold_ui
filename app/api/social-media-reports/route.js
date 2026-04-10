// app/api/social-media-reports/route.js
// GET all social media reports / POST new report

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Croatian month names
const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get('contract_id');
    const year = searchParams.get('year');
    const status = searchParams.get('status');

    let query = supabase
      .from('social_media_reports')
      .select(`
        *,
        recurring_contracts (
          id,
          name,
          clients (
            id,
            name,
            company
          )
        )
      `)
      .order('report_year', { ascending: false })
      .order('report_month', { ascending: false });

    // Apply filters
    if (contractId) {
      query = query.eq('contract_id', contractId);
    }

    if (year) {
      query = query.eq('report_year', parseInt(year));
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching social media reports:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Social media reports GET error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      contract_id,
      report_month,
      report_year,
      content_delivered,
      content_planned,
      posts_published,
      platforms,
      total_reach,
      total_impressions,
      total_engagement,
      avg_engagement_rate,
      follower_growth,
      top_posts,
      paid_ads_enabled,
      paid_ads_spend,
      paid_ads_impressions,
      paid_ads_clicks,
      paid_ads_conversions,
      paid_ads_ctr,
      paid_ads_cpc,
      summary_text,
      highlights,
      recommendations,
      notes
    } = body;

    // Validate required fields
    if (!contract_id || !report_month || !report_year) {
      return Response.json(
        { error: 'contract_id, report_month, and report_year are required' },
        { status: 400 }
      );
    }

    // Get contract info for reference generation
    const { data: contract, error: contractError } = await supabase
      .from('recurring_contracts')
      .select(`
        id,
        name,
        clients (
          id,
          name,
          company
        )
      `)
      .eq('id', contract_id)
      .single();

    if (contractError || !contract) {
      return Response.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Generate reference: SMR-YYYYMM-CLIENTNAME
    const clientName = (contract.clients?.company || contract.clients?.name || 'KLIJENT')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10);
    const monthStr = String(report_month).padStart(2, '0');
    const reference = `SMR-${report_year}${monthStr}-${clientName}`;

    // Calculate period dates
    const periodStart = new Date(report_year, report_month - 1, 1);
    const periodEnd = new Date(report_year, report_month, 0); // Last day of month

    // Create the report
    const { data, error } = await supabase
      .from('social_media_reports')
      .insert({
        contract_id,
        report_month,
        report_year,
        reference,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
        content_delivered: content_delivered || {},
        content_planned: content_planned || {},
        posts_published: posts_published || 0,
        platforms: platforms || {},
        total_reach: total_reach || 0,
        total_impressions: total_impressions || 0,
        total_engagement: total_engagement || 0,
        avg_engagement_rate: avg_engagement_rate || null,
        follower_growth: follower_growth || 0,
        top_posts: top_posts || [],
        paid_ads_enabled: paid_ads_enabled || false,
        paid_ads_spend: paid_ads_spend || null,
        paid_ads_impressions: paid_ads_impressions || null,
        paid_ads_clicks: paid_ads_clicks || null,
        paid_ads_conversions: paid_ads_conversions || null,
        paid_ads_ctr: paid_ads_ctr || null,
        paid_ads_cpc: paid_ads_cpc || null,
        summary_text: summary_text || null,
        highlights: highlights || [],
        recommendations: recommendations || [],
        notes: notes || null,
        status: 'draft'
      })
      .select(`
        *,
        recurring_contracts (
          id,
          name,
          clients (
            id,
            name,
            company
          )
        )
      `)
      .single();

    if (error) {
      if (error.code === '23505') {
        return Response.json(
          { error: `Report for ${CROATIAN_MONTHS[report_month - 1]} ${report_year} already exists for this contract` },
          { status: 409 }
        );
      }
      console.error('Error creating social media report:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Social media reports POST error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
