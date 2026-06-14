import { useRouter } from 'expo-router';

import { PilgrimageHomeScreen } from '../../features/@app-core/features/home/screens/HomeScreen';

export default function HomeRoute() {
  const router = useRouter();

  return (
    <PilgrimageHomeScreen
      onShowConference={() => router.push('/conference')}
      onShowQuartermaster={() => router.push('/quartermaster')}
    />
  );
}
