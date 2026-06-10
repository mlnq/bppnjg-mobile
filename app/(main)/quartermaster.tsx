import { Stack } from 'expo-router';

import { PilgrimageQuartermasterScreen } from '../../features/@app-core/features/quartermaster/screens/PilgrimageQuartermasterScreen';

export default function QuartermasterRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Kwatermistrz' }} />
      <PilgrimageQuartermasterScreen />
    </>
  );
}
