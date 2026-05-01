import { useLocalSearchParams, useRouter } from 'expo-router';

import { PilgrimagePrayerBookEntryScreen } from '../../../../features/@app-core/features/prayer/screens/PilgrimagePrayerBookEntryScreen';
import type { PrayerBookEntryId } from '../../../../features/@app-core/features/prayer/helpers/pilgrimagePrayerBook.helpers';

export default function PrayerBookEntryRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ entryId?: string }>();

  return (
    <PilgrimagePrayerBookEntryScreen
      entryId={(params.entryId as PrayerBookEntryId) ?? 'godzinki'}
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }

        router.replace('/prayer/book');
      }}
    />
  );
}
