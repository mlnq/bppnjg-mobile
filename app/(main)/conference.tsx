import { Stack } from 'expo-router';

import { PilgrimageConferenceScreen } from '../../features/@app-core/features/conference/screens/PilgrimageConferenceScreen';

export default function ConferenceRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Konferencja' }} />
      <PilgrimageConferenceScreen />
    </>
  );
}
