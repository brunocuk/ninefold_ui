// lib/auth.js
// Alternative auth using REST API to bypass client encoding issues

export async function signIn(email, password) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.error_description || data.msg || 'Login failed' } };
    }

    // Store the session
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data));
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: { message: error.message } };
  }
}

export async function signUp(email, password) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.error_description || data.msg || 'Signup failed' } };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: { message: error.message } };
  }
}

export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase.auth.token');
  }
  return { error: null };
}

export async function getUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const tokenData = localStorage.getItem('supabase.auth.token');
  if (!tokenData) {
    return null;
  }

  try {
    const parsed = JSON.parse(tokenData);
    return parsed.user;
  } catch {
    return null;
  }
}

export function onAuthStateChange(callback) {
  // Simple implementation for REST API approach
  return { data: { subscription: { unsubscribe: () => {} } } };
}