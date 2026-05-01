import { useRouter } from 'expo-router';

import { PilgrimageBreviaryScreen } from '../../../features/@app-core/features/breviary/screens/PilgrimageBreviaryScreen';

export default function PrayerBreviaryRoute() {
  const router = useRouter();

  return (
    <PilgrimageBreviaryScreen
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
