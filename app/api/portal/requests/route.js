import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET /api/portal/requests - List requests for a client
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');

    if (!clientId) {
      return Response.json(
        { error: 'Client ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('website_change_requests')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return Response.json({ requests: data });

  } catch (error) {
    console.error('Error fetching requests:', error);
    return Response.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

// POST /api/portal/requests - Create new change request
export async function POST(request) {
  try {
    const body = await request.json();
    const { client_id, submitted_by, title, description, page_url, priority, attachments } = body;

    if (!client_id || !title || !description) {
      return Response.json(
        { error: 'Client ID, title, and description are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('website_change_requests')
      .insert({
        client_id,
        submitted_by: submitted_by || null,
        title: title.trim(),
        description: description.trim(),
        page_url: page_url?.trim() || null,
        priority: priority || 'normal',
        attachments: attachments || [],
        status: 'submitted',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ request: data }, { status: 201 });

  } catch (error) {
    console.error('Error creating request:', error);
    return Response.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
