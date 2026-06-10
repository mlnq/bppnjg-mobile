import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { storePushNotificationAsNewsItem } from '../services/localNotificationNews';
import { notificationsApi } from '../services/notificationsApi';
import { pilgrimageApi } from '../services/pilgrimageApi';
import { prefetchPilgrimageHomeData } from '../services/pilgrimageDataRefresh';
import { resolvePushNotificationRoute } from '../services/pushNotificationNavigation';
import { quartermasterApi } from '../services/quartermasterApi';
import { registerExpoPushToken } from '../services/pushRegistrationApi';
import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
  registerForPushNotificationsAsync,
} from '../services/pushNotifications';
import { setPushDebugInfo } from '../services/pushDebugInfo';
import { showToastOnce } from '../services/appToast';
import { store } from '../store/store';

export function usePushNotifications() {
  const router = useRouter();

  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        const { token, error, projectId, permissionStatus } =
          await registerForPushNotificationsAsync();

        setPushDebugInfo({
          token,
          registrationError: error,
          projectId,
          permissionStatus,
        });

        if (token) {
          console.log('ExpoPushToken:', token);
          await registerExpoPushToken({
            token,
            platform: Platform.OS,
            projectId,
          });
        }

        if (error) {
          console.warn('Push registration error:', error);
          showToastOnce(`Błąd rejestracji push: ${error}`);
        }
      } catch (error) {
        console.warn('Push registration failed:', error);
        showToastOnce(
          error instanceof Error
            ? `Błąd połączenia z API push: ${error.message}`
            : 'Błąd połączenia z API push.'
        );
      }
    };

    void registerForPushNotifications();

    const refreshAppDataFromPush = () => {
      store.dispatch(pilgrimageApi.util.invalidateTags(['PilgrimageData']));
      prefetchPilgrimageHomeData(true);
    };

    const persistNotification = async (notification: Parameters<
      typeof storePushNotificationAsNewsItem
    >[0]) => {
      try {
        refreshAppDataFromPush();
        await storePushNotificationAsNewsItem(notification);
        store.dispatch(notificationsApi.util.invalidateTags(['PilgrimageNotifications']));

        const screen = notification.request.content.data?.screen;

        if (screen === 'quartermaster') {
          store.dispatch(quartermasterApi.util.invalidateTags(['QuartermasterComments']));
        }
      } catch (error) {
        console.warn('Storing push notification failed:', error);
        showToastOnce(
          error instanceof Error
            ? `Nie udało się zapisać powiadomienia lokalnie: ${error.message}`
            : 'Nie udało się zapisać powiadomienia lokalnie.'
        );
      }
    };

    const receivedSubscription = addNotificationReceivedListener((notification) => {
      void persistNotification(notification);
    });

    const responseSubscription = addNotificationResponseListener((response) => {
      void persistNotification(response.notification);

      router.push(resolvePushNotificationRoute(response.notification.request.content.data));
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [router]);
}
