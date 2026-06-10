import { Stack, useRouter } from 'expo-router';

import { PilgrimageHomeScreen } from '../../features/@app-core/features/home/screens/PilgrimageHomeScreen';

export default function HomeRoute() {
  const router = useRouter();

  const navigateToConference = () => {
    router.push('/conference');
  }
  const navigateToQuartermaster = () => {
    router.push('/quartermaster');
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Start' }} />
      <PilgrimageHomeScreen
        onShowConference={navigateToConference}
        onShowQuartermaster={navigateToQuartermaster}
      />
    </>
  );
}
