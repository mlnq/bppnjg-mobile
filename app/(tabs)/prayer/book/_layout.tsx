import { Stack } from 'expo-router';

import { getPilgrimageStackScreenOptions } from '../../../../features/@app-core/components/pilgrimage/getStackScreenOptions';

export default function PrayerBookLayout() {
  const stackScreenOptions = getPilgrimageStackScreenOptions();

  return (
    <Stack
      screenOptions={(props) => ({
        ...stackScreenOptions(props),
        gestureEnabled: true,
        fullScreenGestureEnabled: false,
      })}
    />
  );
}
