import { useRouter } from 'expo-router';

import { PilgrimageHomeScreen } from '../../features/@app-core/features/home/screens/PilgrimageHomeScreen';

export default function HomeRoute() {
  const router = useRouter();

  return (
    <PilgrimageHomeScreen
      onShowNews={() => router.push('/news')}
      onShowConference={() => router.push('/conference')}
      onShowQuartermaster={() => router.push('/quartermaster')}
    />
  );
}
