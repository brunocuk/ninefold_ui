// lib/auth.js
// Auth functions with proper client/server handling

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

export function getUser() {
  // This function should ONLY be called client-side
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const tokenData = localStorage.getItem('supabase.auth.token');
    if (!tokenData) {
      return null;
    }

    const parsed = JSON.parse(tokenData);
    
    // Check if token is expired
    if (parsed.expires_at) {
      const expiresAt = parsed.expires_at * 1000; // Convert to milliseconds
      if (Date.now() > expiresAt) {
        localStorage.removeItem('supabase.auth.token');
        return null;
      }
    }

    return parsed.user || parsed;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export function isAuthenticated() {
  // Quick check if user is logged in (client-side only)
  if (typeof window === 'undefined') {
    return false;
  }
  
  return !!localStorage.getItem('supabase.auth.token');
}

export function onAuthStateChange(callback) {
  // Simple implementation for REST API approach
  return { data: { subscription: { unsubscribe: () => {} } } };
}