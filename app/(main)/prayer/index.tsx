import { useCallback } from 'react';
import { Stack, useRouter } from 'expo-router';

import { PilgrimagePrayerScreen } from '../../../features/@app-core/features/prayer/screens/PilgrimagePrayerScreen';

export default function PrayerRoute() {
  const router = useRouter();

  const handleNavigateToBreviary = useCallback(() => {
    router.push('/prayer/breviary');
  }, [router]);

  const handleNavigateToReadings = useCallback(() => {
    router.push('/prayer/readings');
  }, [router]);

  const handleNavigateToPrayerBook = useCallback(() => {
    router.push('/prayer/book');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: 'Niezbędnik' }} />
      <PilgrimagePrayerScreen
        onNavigateToBreviary={handleNavigateToBreviary}
        onNavigateToReadings={handleNavigateToReadings}
        onNavigateToPrayerBook={handleNavigateToPrayerBook}
      />
    </>
  );
}
