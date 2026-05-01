import { createContext, createElement, ReactNode, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useGpsPermission } from './useGpsPermission';

type UserLocationValue = {
  isLoading: boolean;
  currentLocation: Location.LocationObjectCoords | null;
  hasPermission: boolean;
  isServicesEnabled: boolean;
};

const UserLocationContext = createContext<UserLocationValue | null>(null);

function useUserLocationState(): UserLocationValue {
  const { isLoading: isPermissionLoading, isGranted, isServicesEnabled } = useGpsPermission();
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(
    null
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let isMounted = true;

    if (isPermissionLoading) {
      return () => {
        isMounted = false;
        subscription?.remove();
      };
    }

    if (!isGranted || !isServicesEnabled) {
      setCurrentLocation(null);
      setIsLocationLoading(false);
      return () => {
        isMounted = false;
        subscription?.remove();
      };
    }

    setIsLocationLoading(true);

    (async () => {
      try {
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted) {
          setCurrentLocation(initialLocation.coords);
          setIsLocationLoading(false);
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location: Location.LocationObject) => {
            if (!isMounted) {
              return;
            }

            setCurrentLocation(location.coords);
            setIsLocationLoading(false);
          }
        );
      } catch {
        if (!isMounted) {
          return;
        }

        setCurrentLocation(null);
        setIsLocationLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [isGranted, isPermissionLoading, isServicesEnabled]);

  return {
    isLoading: isPermissionLoading || isLocationLoading,
    currentLocation,
    hasPermission: isGranted,
    isServicesEnabled,
  };
}

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const value = useUserLocationState();

  return createElement(UserLocationContext.Provider, { value }, children);
}

export function useUserLocation() {
  const context = useContext(UserLocationContext);

  if (!context) {
    throw new Error('useUserLocation must be used within UserLocationProvider');
  }

  return context;
}
