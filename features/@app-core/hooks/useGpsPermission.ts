import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Location from 'expo-location';

type UseGpsPermissionOptions = {
  enabled?: boolean;
};

export function useGpsPermission({ enabled = true }: UseGpsPermissionOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isGranted, setIsGranted] = useState(false);
  const [isServicesEnabled, setIsServicesEnabled] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setIsGranted(false);
      setIsServicesEnabled(false);
      return;
    }

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
  }, [enabled]);

  return { isLoading, isGranted, isServicesEnabled };
}
