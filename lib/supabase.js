// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We handle session manually
    autoRefreshToken: false,
  },
})

// Helper function to get an authenticated client
export function getAuthenticatedClient() {
  if (typeof window === 'undefined') {
    return supabase;
  }

  const tokenData = localStorage.getItem('supabase.auth.token');
  if (tokenData) {
    try {
      const parsed = JSON.parse(tokenData);
      const accessToken = parsed.access_token;

      if (accessToken) {
        // Create a new client with the access token
        return createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }

  return supabase;
}