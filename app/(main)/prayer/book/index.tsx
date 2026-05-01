import { useRouter } from 'expo-router';

import { PilgrimagePrayerBookScreen } from '../../../../features/@app-core/features/prayer/screens/PilgrimagePrayerBookScreen';

export default function PrayerBookRoute() {
  const router = useRouter();

  return (
    <PilgrimagePrayerBookScreen
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }

        router.replace('/prayer');
      }}
      onSelectEntry={(entryId) => router.push(`/prayer/book/${entryId}`)}
    />
  );
}
