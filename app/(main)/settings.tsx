import { Stack } from 'expo-router';

import { PilgrimageSettingsScreen } from '../../features/@app-core/features/settings/screens/SettingsScreen';

export default function SettingsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ustawienia' }} />
      <PilgrimageSettingsScreen />
    </>
  );
}
