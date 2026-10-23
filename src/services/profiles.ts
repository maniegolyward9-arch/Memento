import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
}

export type ProfileInsert = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  [key: string]: unknown;
};

export type ProfileUpdate = Partial<Omit<Profile, 'id'>> & {
  [key: string]: unknown;
};

/**
 * Insert a profile
 *
 * @example
 * await insertProfile({
 *   id: user.id,
 *   email: user.email,
 *   full_name: 'John Doe',
 * });
 */
export async function insertProfile(profile: ProfileInsert) {
  return await supabase
    .from('profiles')
    .insert(profile);
}

/**
 * Fetch all profiles
 *
 * @example
 * const { data, error } = await getProfiles();
 */
export async function getProfiles() {
  return await supabase
    .from('profiles')
    .select('*');
}

/**
 * Fetch a single profile by user ID
 *
 * @example
 * const { data, error } = await getProfileById(user.id);
 */
export async function getProfileById(id: string) {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
}

/**
 * Update a profile by user ID
 *
 * @example
 * await updateProfile(user.id, {
 *   full_name: 'Jane Doe',
 * });
 */
export async function updateProfile(id: string, updates: ProfileUpdate) {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id);
}

/**
 * Delete a profile by user ID
 *
 * @example
 * await deleteProfile(user.id);
 */
export async function deleteProfile(id: string) {
  return await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
}
