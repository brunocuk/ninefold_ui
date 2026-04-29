import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST /api/portal/content/[id]/revision
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { feedback } = body;

    if (!feedback || !feedback.trim()) {
      return Response.json(
        { error: 'Feedback is required' },
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

    // Update content status to revision_requested
    const { data, error } = await supabase
      .from('content_items')
      .update({
        status: 'revision_requested',
        client_feedback: feedback.trim(),
        approved_at: null,
        approved_by: null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ content: data });

  } catch (error) {
    console.error('Revision request error:', error);
    return Response.json(
      { error: 'Failed to request revision' },
      { status: 500 }
    );
  }
}
