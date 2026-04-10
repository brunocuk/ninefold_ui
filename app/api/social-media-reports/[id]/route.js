// app/api/social-media-reports/[id]/route.js
// GET, PATCH, DELETE individual social media report

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const incrementView = searchParams.get('view') === 'true';

    // Get the report with related data
    const { data, error } = await supabase
      .from('social_media_reports')
      .select(`
        *,
        recurring_contracts (
          id,
          name,
          contract_type,
          metadata,
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

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Social media report not found' }, { status: 404 });
      }
      console.error('Error fetching social media report:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Increment view count if requested (for public preview)
    if (incrementView) {
      await supabase
        .from('social_media_reports')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Social media report GET error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['draft', 'generated', 'sent'];
      if (!validStatuses.includes(body.status)) {
        return Response.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updateData = {};
    const allowedFields = [
      'content_delivered',
      'content_planned',
      'posts_published',
      'platforms',
      'total_reach',
      'total_impressions',
      'total_engagement',
      'avg_engagement_rate',
      'follower_growth',
      'top_posts',
      'paid_ads_enabled',
      'paid_ads_spend',
      'paid_ads_impressions',
      'paid_ads_clicks',
      'paid_ads_conversions',
      'paid_ads_ctr',
      'paid_ads_cpc',
      'summary_text',
      'notes',
      'highlights',
      'recommendations',
      'status',
      'sent_at',
      'sent_to',
      'email_id'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('social_media_reports')
      .update(updateData)
      .eq('id', id)
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
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Social media report not found' }, { status: 404 });
      }
      console.error('Error updating social media report:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Social media report PATCH error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('social_media_reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting social media report:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Social media report DELETE error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
