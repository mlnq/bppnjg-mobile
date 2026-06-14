import { Stack } from 'expo-router';

import { PilgrimageMassReadingsScreen } from '../../../features/@app-core/features/mass-readings/screens/MassReadingsScreen';

export default function PrayerReadingsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Czytania z Mszy' }} />
      <PilgrimageMassReadingsScreen />
    </>
  );
}
