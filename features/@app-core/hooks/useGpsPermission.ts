import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Location from 'expo-location';

export function useGpsPermission() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGranted, setIsGranted] = useState(false);
  const [isServicesEnabled, setIsServicesEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let appState = AppState.currentState;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const syncGpsState = async () => {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();

        if (!isMounted) {
          return;
        }

        setIsServicesEnabled(servicesEnabled);

        if (!servicesEnabled) {
          setIsGranted(false);
          setIsLoading(false);
          return;
        }

        const permission = await Location.getForegroundPermissionsAsync();
        const nextPermission =
          permission.status === 'undetermined'
            ? await Location.requestForegroundPermissionsAsync()
            : permission;

        if (!isMounted) {
          return;
        }

        setIsGranted(nextPermission.status === 'granted');
      } catch {
        if (!isMounted) {
          return;
        }

        setIsServicesEnabled(false);
        setIsGranted(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const wasInactive = appState !== 'active' && nextAppState === 'active';
      appState = nextAppState;

      if (wasInactive) {
        void syncGpsState();
      }
    };

    void syncGpsState();
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    pollInterval = setInterval(() => {
      if (appState === 'active') {
        void syncGpsState();
      }
    }, 5000);

    return () => {
      isMounted = false;
      appStateSubscription.remove();
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  return { isLoading, isGranted, isServicesEnabled };
}
