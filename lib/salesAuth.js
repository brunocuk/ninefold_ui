// lib/salesAuth.js
// Authentication for sales users (salespeople like Karlo)
// Uses custom sales_users table with bcrypt password hashing, mirrors lib/portalAuth.js

import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

const STORAGE_KEY = 'sales.auth.session';

/**
 * Sign in a sales user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function salesSignIn(email, password) {
  try {
    const { data: user, error: fetchError } = await supabase
      .from('sales_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !user) {
      return { data: null, error: { message: 'Netočan email ili lozinka' } };
    }

    if (!user.active) {
      return { data: null, error: { message: 'Račun je deaktiviran. Javi se Brunu.' } };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return { data: null, error: { message: 'Netočan email ili lozinka' } };
    }

    await supabase
      .from('sales_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        commission_rate: user.commission_rate,
      },
      expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }

    return { data: session, error: null };
  } catch (error) {
    console.error('Sales sign in error:', error);
    return { data: null, error: { message: 'Greška pri prijavi. Pokušajte ponovo.' } };
  }
}

/**
 * Sign out the current sales user
 */
export async function salesSignOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { error: null };
}

/**
 * Get the current sales user (async, with session validation)
 * @returns {Promise<object|null>}
 */
export async function getSalesUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const sessionData = localStorage.getItem(STORAGE_KEY);
    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData);

    if (session.expires_at && Date.now() > session.expires_at) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error getting sales user:', error);
    return null;
  }
}

/**
 * Get sales user synchronously (for quick checks)
 * @returns {object|null}
 */
export function getSalesUserSync() {
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
 * Check if sales user is authenticated
 * @returns {boolean}
 */
export function isSalesAuthenticated() {
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
 * Create a new sales user (admin function, used from the CRM)
 * @param {object} userData - { email, password, name, phone, commission_rate }
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function createSalesUser({ email, password, name, phone = null, commission_rate = 0.2 }) {
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('sales_users')
      .insert({
        email: email.toLowerCase(),
        password_hash,
        name,
        phone,
        commission_rate,
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
    console.error('Error creating sales user:', error);
    return { data: null, error: { message: 'Greška pri kreiranju korisnika' } };
  }
}

/**
 * Verify current password for a sales user
 * @param {string} userId
 * @param {string} currentPassword
 * @returns {Promise<{valid: boolean, error: object|null}>}
 */
export async function verifySalesUserPassword(userId, currentPassword) {
  try {
    const { data: user, error: fetchError } = await supabase
      .from('sales_users')
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
 * Change sales user password (verifies current password first)
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<{error: object|null}>}
 */
export async function changeSalesUserPassword(userId, currentPassword, newPassword) {
  try {
    const { valid, error: verifyError } = await verifySalesUserPassword(userId, currentPassword);

    if (verifyError) {
      return { error: verifyError };
    }

    if (!valid) {
      return { error: { message: 'Trenutna lozinka nije ispravna' } };
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    const { error } = await supabase
      .from('sales_users')
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
 * Update sales user password (admin function, no verification)
 * @param {string} userId
 * @param {string} newPassword
 * @returns {Promise<{error: object|null}>}
 */
export async function updateSalesUserPassword(userId, newPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    const { error } = await supabase
      .from('sales_users')
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
 * Activate/deactivate a sales user (admin function)
 * @param {string} userId
 * @param {boolean} active
 * @returns {Promise<{error: object|null}>}
 */
export async function setSalesUserActive(userId, active) {
  try {
    const { error } = await supabase
      .from('sales_users')
      .update({ active, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating sales user:', error);
    return { error: { message: 'Greška pri ažuriranju korisnika' } };
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
