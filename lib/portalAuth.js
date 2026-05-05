// lib/portalAuth.js
// Portal authentication functions for client users
// Uses custom portal_users table with bcrypt password hashing

import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

const STORAGE_KEY = 'portal.auth.session';

/**
 * Sign in a portal user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function portalSignIn(email, password) {
  try {
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
      return { data: null, error: { message: 'Netočan email ili lozinka' } };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return { data: null, error: { message: 'Netočan email ili lozinka' } };
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

    // Store session
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }

    return { data: session, error: null };
  } catch (error) {
    console.error('Portal sign in error:', error);
    return { data: null, error: { message: 'Greška pri prijavi. Pokušajte ponovo.' } };
  }
}

/**
 * Sign out the current portal user
 */
export async function portalSignOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { error: null };
}

/**
 * Get the current portal user (async, with session validation)
 * @returns {Promise<object|null>}
 */
export async function getPortalUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const sessionData = localStorage.getItem(STORAGE_KEY);
    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData);

    // Check if session expired
    if (session.expires_at && Date.now() > session.expires_at) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error getting portal user:', error);
    return null;
  }
}

/**
 * Get portal user synchronously (for quick checks)
 * @returns {object|null}
 */
export function getPortalUserSync() {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem(STORAGE_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);

    if (session.expires_at && Date.now() > session.expires_at) {
      return null;
    }

    return session.user;
  } catch (error) {
    return null;
  }
}

/**
 * Check if portal user is authenticated
 * @returns {boolean}
 */
export function isPortalAuthenticated() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const sessionData = localStorage.getItem(STORAGE_KEY);
    if (!sessionData) return false;

    const session = JSON.parse(sessionData);
    return session.expires_at && Date.now() < session.expires_at;
  } catch {
    return false;
  }
}

/**
 * Get the full session object
 * @returns {object|null}
 */
export function getPortalSession() {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem(STORAGE_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    if (session.expires_at && Date.now() > session.expires_at) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Create a new portal user (admin function)
 * @param {object} userData - { email, password, name, client_id, role }
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function createPortalUser({ email, password, name, client_id, role = 'viewer' }) {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const { data, error } = await supabase
      .from('portal_users')
      .insert({
        email: email.toLowerCase(),
        password_hash,
        name,
        client_id,
        role,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { data: null, error: { message: 'Korisnik s tom email adresom već postoji' } };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating portal user:', error);
    return { data: null, error: { message: 'Greška pri kreiranju korisnika' } };
  }
}

/**
 * Verify current password for a portal user
 * @param {string} userId
 * @param {string} currentPassword
 * @returns {Promise<{valid: boolean, error: object|null}>}
 */
export async function verifyPortalUserPassword(userId, currentPassword) {
  try {
    const { data: user, error: fetchError } = await supabase
      .from('portal_users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return { valid: false, error: { message: 'Korisnik nije pronađen' } };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    return { valid: isValid, error: null };
  } catch (error) {
    console.error('Error verifying password:', error);
    return { valid: false, error: { message: 'Greška pri provjeri lozinke' } };
  }
}

/**
 * Change portal user password (verifies current password first)
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<{error: object|null}>}
 */
export async function changePortalUserPassword(userId, currentPassword, newPassword) {
  try {
    // First verify current password
    const { valid, error: verifyError } = await verifyPortalUserPassword(userId, currentPassword);

    if (verifyError) {
      return { error: verifyError };
    }

    if (!valid) {
      return { error: { message: 'Trenutna lozinka nije ispravna' } };
    }

    // Update to new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    const { error } = await supabase
      .from('portal_users')
      .update({ password_hash })
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error changing password:', error);
    return { error: { message: 'Greška pri promjeni lozinke' } };
  }
}

/**
 * Update portal user password (admin function, no verification)
 * @param {string} userId
 * @param {string} newPassword
 * @returns {Promise<{error: object|null}>}
 */
export async function updatePortalUserPassword(userId, newPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    const { error } = await supabase
      .from('portal_users')
      .update({ password_hash })
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { error: { message: 'Greška pri ažuriranju lozinke' } };
  }
}

/**
 * Delete a portal user
 * @param {string} userId
 * @returns {Promise<{error: object|null}>}
 */
export async function deletePortalUser(userId) {
  try {
    const { error } = await supabase
      .from('portal_users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting portal user:', error);
    return { error: { message: 'Greška pri brisanju korisnika' } };
  }
}

/**
 * Get all portal users for a client
 * @param {string} clientId
 * @returns {Promise<{data: array|null, error: object|null}>}
 */
export async function getPortalUsersByClient(clientId) {
  try {
    const { data, error } = await supabase
      .from('portal_users')
      .select('id, email, name, role, avatar_url, last_login_at, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching portal users:', error);
    return { data: null, error: { message: 'Greška pri dohvaćanju korisnika' } };
  }
}

/**
 * Generate a random password
 * @param {number} length
 * @returns {string}
 */
export function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
