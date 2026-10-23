import { supabase } from '@/lib/supabase';

export const AVATARS_BUCKET = 'avatars';

export type UploadFileInput = Parameters<ReturnType<typeof supabase.storage.from>['upload']>[1];
export type UploadOptions = Parameters<ReturnType<typeof supabase.storage.from>['upload']>[2];

/**
 * Upload an avatar file to the avatars bucket
 *
 * @param path Storage file path (e.g. 'user/avatar.jpg' or `${userId}/avatar.png`)
 * @param file File data (ArrayBuffer | ArrayBufferView | Blob | Buffer | File | FormData | string)
 * @param options Storage upload options (e.g. upsert, contentType)
 */
export async function uploadAvatar(
  path: string,
  file: UploadFileInput,
  options?: UploadOptions
) {
  return await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, options);
}

/**
 * Get the public URL for an avatar in the avatars bucket
 *
 * @param path Storage file path (e.g. 'user/avatar.jpg')
 * @returns Object containing data.publicUrl
 */
export function getAvatarUrl(path: string) {
  return supabase.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(path);
}

/**
 * Delete an avatar from the avatars bucket
 *
 * @param paths File path or array of file paths to remove
 */
export async function deleteAvatar(paths: string[]) {
  return await supabase.storage
    .from(AVATARS_BUCKET)
    .remove(paths);
}
