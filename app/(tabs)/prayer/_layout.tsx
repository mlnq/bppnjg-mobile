import { Stack } from 'expo-router';

import { sharedHeaderStyles } from '../../../features/@app-core/components/pilgrimage/getStackScreenOptions';

export default function PrayerLayout() {
  return (
    <Stack
      screenOptions={{
        ...sharedHeaderStyles,
        headerBackTitle: '',
        gestureEnabled: true,
        fullScreenGestureEnabled: false,
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="breviary" options={{ title: 'Brewiarz' }} />
      <Stack.Screen name="readings" options={{ title: 'Czytania z Mszy' }} />
      <Stack.Screen name="book" options={{ headerShown: false }} />
    </Stack>
  );
}
