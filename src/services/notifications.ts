import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';

// Configure foreground notification presentation
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface UserDevice {
  id?: string;
  user_id: string;
  push_token: string;
  platform?: string;
  device_name?: string | null;
  updated_at?: string;
  created_at?: string;
}

/**
 * Register for Expo Push Notifications and return the push token.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token: permission not granted');
    return null;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    return tokenResponse.data;
  } catch (error) {
    console.error('Error fetching Expo push token:', error);
    return null;
  }
}

/**
 * Convenience helper to directly fetch the current Expo push token
 */
export async function getExpoPushToken(): Promise<string> {
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

/**
 * Store or upsert a push token into the `user_devices` Supabase table
 */
export async function saveUserDeviceToken(userId: string, pushToken: string) {
  return await supabase
    .from('user_devices')
    .upsert(
      {
        user_id: userId,
        push_token: pushToken,
        platform: Platform.OS,
        device_name: Device.modelName ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,push_token' }
    );
}

/**
 * Register push notification and save token directly to `user_devices`
 */
export async function registerAndSaveDeviceToken(userId: string): Promise<string | null> {
  const token = await registerForPushNotificationsAsync();
  if (token) {
    await saveUserDeviceToken(userId, token);
  }
  return token;
}

/**
 * Remove a device push token from `user_devices` (e.g. on logout)
 */
export async function removeUserDeviceToken(userId: string, pushToken: string) {
  return await supabase
    .from('user_devices')
    .delete()
    .eq('user_id', userId)
    .eq('push_token', pushToken);
}

export { Notifications };

