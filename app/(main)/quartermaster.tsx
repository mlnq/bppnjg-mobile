import { Stack } from 'expo-router';

import { PilgrimageQuartermasterScreen } from '../../features/@app-core/features/quartermaster/screens/QuartermasterScreen';

export default function QuartermasterRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Kwatermistrz' }} />
      <PilgrimageQuartermasterScreen />
    </>
  );
}
