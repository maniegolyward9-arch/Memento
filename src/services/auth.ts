import { supabase } from '@/lib/supabase';
import type { AuthResponse, AuthTokenResponsePassword, UserResponse } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password }: AuthCredentials): Promise<AuthResponse> {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn({ email, password }: AuthCredentials): Promise<AuthTokenResponsePassword> {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign out the currently authenticated user
 */
export async function signOut() {
  return await supabase.auth.signOut();
}

/**
 * Get the currently authenticated user
 */
export async function getUser(): Promise<UserResponse> {
  return await supabase.auth.getUser();
}

/**
 * Get the current session
 */
export async function getSession() {
  return await supabase.auth.getSession();
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) {
  return supabase.auth.onAuthStateChange(callback);
}
