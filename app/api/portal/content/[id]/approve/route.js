import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST /api/portal/content/[id]/approve
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { user_id, comment } = body;

    if (!user_id) {
      return Response.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Verify the content exists
    const { data: content, error: fetchError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !content) {
      return Response.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Update content status to approved
    const { data, error } = await supabase
      .from('content_items')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user_id,
        client_feedback: comment || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ content: data });

  } catch (error) {
    console.error('Content approval error:', error);
    return Response.json(
      { error: 'Failed to approve content' },
      { status: 500 }
    );
  }
}
