import { Stack } from 'expo-router';

import { PilgrimageRouteScreen } from '../../features/@app-core/features/route/screens/RouteScreen';

export default function RouteRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Trasa' }} />
      <PilgrimageRouteScreen />
    </>
  );
}
