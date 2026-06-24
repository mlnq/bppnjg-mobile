import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { PilgrimagePrayerScreen } from '../../../features/@app-core/features/prayer/screens/PrayerScreen';

export default function PrayerRoute() {
  const router = useRouter();

  const handleNavigateToBreviary = useCallback(() => router.push('/breviary'), [router]);
  const handleNavigateToReadings = useCallback(() => router.push('/readings'), [router]);
  const handleNavigateToPrayerBook = useCallback(() => router.push('/prayer-book'), [router]);

  return (
    <PilgrimagePrayerScreen
      onNavigateToBreviary={handleNavigateToBreviary}
      onNavigateToReadings={handleNavigateToReadings}
      onNavigateToPrayerBook={handleNavigateToPrayerBook}
    />
  );
}
