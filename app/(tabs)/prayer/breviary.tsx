import { Stack } from 'expo-router';

import { PilgrimageBreviaryScreen } from '../../../features/@app-core/features/breviary/screens/BreviaryScreen';

export default function PrayerBreviaryRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Brewiarz' }} />
      <PilgrimageBreviaryScreen />
    </>
  );
}
