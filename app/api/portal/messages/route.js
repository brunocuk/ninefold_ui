import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET /api/portal/messages - List messages for a client
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
      .from('portal_messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json({ messages: data });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/portal/messages - Send new message
export async function POST(request) {
  try {
    const body = await request.json();
    const { client_id, sender_type, sender_id, sender_name, message, attachments, related_to_type, related_to_id } = body;

    if (!client_id || !sender_type || !sender_name || !message) {
      return Response.json(
        { error: 'Client ID, sender type, sender name, and message are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('portal_messages')
      .insert({
        client_id,
        sender_type,
        sender_id: sender_id || null,
        sender_name,
        message: message.trim(),
        attachments: attachments || [],
        related_to_type: related_to_type || null,
        related_to_id: related_to_id || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ message: data }, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PATCH /api/portal/messages - Mark messages as read
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { message_ids } = body;

    if (!message_ids || !Array.isArray(message_ids) || message_ids.length === 0) {
      return Response.json(
        { error: 'Message IDs required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('portal_messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', message_ids);

    if (error) {
      throw error;
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    return Response.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
