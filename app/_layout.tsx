import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';

import { AppToastHost } from '../features/@app-core/components/AppToastHost';
import { OFFICE_OPTIONS } from '../features/@app-core/features/breviary/helpers/pilgrimageBreviary.helpers';
import { UserLocationProvider } from '../features/@app-core/hooks/useUserLocation';
import { usePushNotifications } from '../features/@app-core/hooks/usePushNotifications';
import { brewiarzApi } from '../features/@app-core/services/brewiarzApi';
import { niedzielaApi } from '../features/@app-core/services/niedzielaApi';
import { persistor, store } from '../features/@app-core/store/store';
import '../global.css';

function AppBootstrap() {
  usePushNotifications();

  useEffect(() => {
    store.dispatch(
      niedzielaApi.util.prefetch('getDailyReadings', undefined, {
        force: false,
      })
    );

    for (const { id } of OFFICE_OPTIONS) {
      store.dispatch(
        brewiarzApi.util.prefetch('getBreviaryOffice', id, {
          force: false,
        })
      );
    }
  }, []);

  return (
    <SafeAreaProvider>
      <UserLocationProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
        <AppToastHost />
      </UserLocationProvider>
    </SafeAreaProvider>
  );
}

function RootProviders() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppBootstrap />
      </PersistGate>
    </Provider>
  );
}

export default function RootLayout() {
  return <RootProviders />;
}
