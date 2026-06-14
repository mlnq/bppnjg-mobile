import { Stack } from 'expo-router';

import { getPilgrimageStackScreenOptions } from '../../../features/@app-core/components/pilgrimage/getStackScreenOptions';

export default function PrayerLayout() {
  const stackScreenOptions = getPilgrimageStackScreenOptions({
    hideBackRoutes: new Set<string>(['index']),
  });

  return (
    <Stack
      screenOptions={(props) => ({
        ...stackScreenOptions(props),
        gestureEnabled: true,
        fullScreenGestureEnabled: false,
      })}>
      <Stack.Screen
        name="book"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
