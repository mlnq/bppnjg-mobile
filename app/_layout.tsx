import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';

import { AppToastHost } from '../features/@app-core/components/AppToastHost';
import { UserLocationProvider } from '../features/@app-core/hooks/useUserLocation';
import { usePushNotifications } from '../features/@app-core/hooks/usePushNotifications';
import { persistor, store } from '../features/@app-core/store/store';
import '../global.css';

function AppBootstrap() {
  usePushNotifications();

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
