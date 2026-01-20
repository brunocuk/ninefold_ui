// lib/auth.js
// Auth functions with proper client/server handling

// Refresh the access token using the refresh token
export async function refreshSession() {
  if (typeof window === 'undefined') return null;

  try {
    const tokenData = localStorage.getItem('supabase.auth.token');
    if (!tokenData) return null;

    const parsed = JSON.parse(tokenData);
    if (!parsed.refresh_token) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          refresh_token: parsed.refresh_token,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Token refresh failed:', data);
      localStorage.removeItem('supabase.auth.token');
      return null;
    }

    // Store the new session
    localStorage.setItem('supabase.auth.token', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
}

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

    // Check if token is expired or about to expire (within 5 minutes)
    if (parsed.expires_at) {
      const expiresAt = parsed.expires_at * 1000; // Convert to milliseconds
      const fiveMinutes = 5 * 60 * 1000;

      if (Date.now() > expiresAt) {
        // Token expired, try to refresh
        const refreshed = await refreshSession();
        if (!refreshed) {
          localStorage.removeItem('supabase.auth.token');
          return null;
        }
        return refreshed.user || refreshed;
      } else if (Date.now() > expiresAt - fiveMinutes) {
        // Token about to expire, refresh in background
        refreshSession();
      }
    }

    return parsed.user || parsed;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Synchronous version for quick checks (won't refresh)
export function getUserSync() {
  if (typeof window === 'undefined') return null;

  try {
    const tokenData = localStorage.getItem('supabase.auth.token');
    if (!tokenData) return null;

    const parsed = JSON.parse(tokenData);

    if (parsed.expires_at) {
      const expiresAt = parsed.expires_at * 1000;
      if (Date.now() > expiresAt) {
        return null;
      }
    }

    return parsed.user || parsed;
  } catch (error) {
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