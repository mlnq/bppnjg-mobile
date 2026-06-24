import { Stack } from 'expo-router';

import { sharedHeaderStyles } from '../../../features/@app-core/components/pilgrimage/getStackScreenOptions';

export default function PrayerLayout() {
  return (
    <Stack
      screenOptions={{
        ...sharedHeaderStyles,
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
