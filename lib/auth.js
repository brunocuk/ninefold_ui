// lib/auth.js
// Fixed version with correct Supabase method names

import { supabase } from './supabase';

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password, // Supabase should handle this
  });

  return { data, error };
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// FIXED: Correct method name
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}