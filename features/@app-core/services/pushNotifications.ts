import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type PushRegistrationResult = {
  token: string | null;
  error: string | null;
  projectId: string | null;
  permissionStatus: string | null;
};

function getExpoProjectId() {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
    null
  );
}

export async function configureAndroidNotificationChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#A65A3A',
    sound: 'default',
  });
}

export async function registerForPushNotificationsAsync(): Promise<PushRegistrationResult> {
  await configureAndroidNotificationChannel();

  if (!Device.isDevice) {
    return {
      token: null,
      error: 'Push notifications wymagają fizycznego urządzenia.',
      projectId: getExpoProjectId(),
      permissionStatus: 'device-required',
    };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const permissionResult = await Notifications.requestPermissionsAsync();
    finalStatus = permissionResult.status;
  }

  if (finalStatus !== 'granted') {
    return {
      token: null,
      error: 'Brak zgody użytkownika na powiadomienia push.',
      projectId: getExpoProjectId(),
      permissionStatus: finalStatus,
    };
  }

  const projectId = getExpoProjectId();

  if (!projectId) {
    return {
      token: null,
      error: 'Brakuje EAS projectId. Ustaw EXPO_PUBLIC_EAS_PROJECT_ID lub skonfiguruj projekt EAS.',
      projectId: null,
      permissionStatus: finalStatus,
    };
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    return {
      token,
      error: null,
      projectId,
      permissionStatus: finalStatus,
    };
  } catch (error) {
    return {
      token: null,
      error: error instanceof Error ? error.message : 'Nie udało się pobrać ExpoPushToken.',
      projectId,
      permissionStatus: finalStatus,
    };
  }
}

export function addNotificationReceivedListener(
  listener: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(listener);
}

export function addNotificationResponseListener(
  listener: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(listener);
}
