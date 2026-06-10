import { Stack } from 'expo-router';

import { PilgrimagePrayerBookScreen } from '../../../../features/@app-core/features/prayer/screens/PilgrimagePrayerBookScreen';

export default function PrayerBookRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Modlitewnik' }} />
      <PilgrimagePrayerBookScreen />
    </>
  );
}
