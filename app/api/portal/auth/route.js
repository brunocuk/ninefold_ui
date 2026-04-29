import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST /api/portal/auth - Login
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email i lozinka su obavezni' },
        { status: 400 }
      );
    }

    // Find user by email
    const { data: user, error: fetchError } = await supabase
      .from('portal_users')
      .select(`
        *,
        client:clients(id, name, company)
      `)
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !user) {
      return Response.json(
        { error: 'Netočan email ili lozinka' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return Response.json(
        { error: 'Netočan email ili lozinka' },
        { status: 401 }
      );
    }

    // Update last login
    await supabase
      .from('portal_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // Create session object (excluding password_hash)
    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        client_id: user.client_id,
        client: user.client,
      },
      expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };

    return Response.json({ session });

  } catch (error) {
    console.error('Portal auth error:', error);
    return Response.json(
      { error: 'Greška pri prijavi' },
      { status: 500 }
    );
  }
}
