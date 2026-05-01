import { useRouter } from 'expo-router';

import { PilgrimageMassReadingsScreen } from '../../../features/@app-core/features/mass-readings/screens/PilgrimageMassReadingsScreen';

export default function PrayerReadingsRoute() {
  const router = useRouter();

  return (
    <PilgrimageMassReadingsScreen
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }

        router.replace('/prayer');
      }}
    />
  );
}
