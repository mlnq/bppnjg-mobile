import { Stack, useLocalSearchParams } from 'expo-router';

import { PilgrimagePrayerBookEntryScreen } from '../../../../features/@app-core/features/prayer/screens/PilgrimagePrayerBookEntryScreen';
import {
  getPrayerBookEntryById,
  type PrayerBookEntryId,
} from '../../../../features/@app-core/features/prayer/helpers/pilgrimagePrayerBook.helpers';

export default function PrayerBookEntryRoute() {
  const params = useLocalSearchParams<{ entryId?: string }>();
  const entryId = (params.entryId as PrayerBookEntryId) ?? 'godzinki';
  const entry = getPrayerBookEntryById(entryId);

  return (
    <>
      <Stack.Screen options={{ title: entry?.title ?? 'Modlitewnik' }} />
      <PilgrimagePrayerBookEntryScreen entryId={entryId} />
    </>
  );
}
