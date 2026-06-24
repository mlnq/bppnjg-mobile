import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';

import { AppToastHost } from '../features/@app-core/components/AppToastHost';
import { HeaderBackButton } from '../features/@app-core/components/HeaderBackButton';
import { sharedHeaderStyles } from '../features/@app-core/components/pilgrimage/getStackScreenOptions';
import { OFFICE_OPTIONS } from '../features/@app-core/features/breviary/helpers/pilgrimageBreviary.helpers';
import { UserLocationProvider } from '../features/@app-core/hooks/useUserLocation';
import { usePushNotifications } from '../features/@app-core/hooks/usePushNotifications';
import { brewiarzApi } from '../features/@app-core/services/brewiarzApi';
import { niedzielaApi } from '../features/@app-core/services/niedzielaApi';
import { persistor, store } from '../features/@app-core/store/store';
import '../global.css';

function BackButton() {
  const navigation = useNavigation();
  if (!navigation.canGoBack()) return null;
  return <HeaderBackButton onPress={() => navigation.goBack()} />;
}

const backButtonScreenOptions = {
  headerBackVisible: false,
  headerLeft: () => <BackButton />,
} as const;

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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              ...sharedHeaderStyles,
              ...backButtonScreenOptions,
              headerShown: true,
              title: 'Ustawienia',
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="conference"
            options={{
              ...sharedHeaderStyles,
              ...backButtonScreenOptions,
              headerShown: true,
              title: 'Konferencja',
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="quartermaster"
            options={{
              ...sharedHeaderStyles,
              ...backButtonScreenOptions,
              headerShown: true,
              title: 'Kwatermistrz',
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="quartermaster/[commentId]"
            options={{
              ...sharedHeaderStyles,
              ...backButtonScreenOptions,
              headerShown: true,
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="breviary"
            options={{
              ...sharedHeaderStyles,
              ...backButtonScreenOptions,
              headerShown: true,
              title: 'Brewiarz',
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="readings"
            options={{
              ...sharedHeaderStyles,
              ...backButtonScreenOptions,
              headerShown: true,
              title: 'Czytania z Mszy',
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="prayer-book"
            options={{
              ...sharedHeaderStyles,
              ...backButtonScreenOptions,
              headerShown: true,
              title: 'Modlitewnik',
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="prayer-book/[entryId]"
            options={{
              ...sharedHeaderStyles,
              ...backButtonScreenOptions,
              headerShown: true,
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
        </Stack>
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
