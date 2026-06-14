import { Stack } from 'expo-router';

import { SettingsButton } from '../../../features/@app-core/components/SettingsButton';
import { HeaderBackButton } from '../../../features/@app-core/components/HeaderBackButton';
import { sharedHeaderStyles } from '../../../features/@app-core/components/pilgrimage/getStackScreenOptions';

export default function PrayerLayout() {
  return (
    <Stack
      screenOptions={({ route, navigation }) => ({
        ...sharedHeaderStyles,
        headerBackVisible: false,
        headerRight: route.name === 'index' ? () => <SettingsButton /> : undefined,
        headerLeft:
          navigation.canGoBack()
            ? () => <HeaderBackButton onPress={() => navigation.goBack()} />
            : undefined,
        gestureEnabled: true,
        fullScreenGestureEnabled: false,
      })}>
      <Stack.Screen name="index" options={{ title: 'Niezbędnik' }} />
      <Stack.Screen name="breviary" options={{ title: 'Brewiarz' }} />
      <Stack.Screen name="readings" options={{ title: 'Czytania z Mszy' }} />
      <Stack.Screen name="book" options={{ headerShown: false }} />
    </Stack>
  );
}
