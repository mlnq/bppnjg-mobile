import { Stack } from 'expo-router';

import { PilgrimageNewsScreen } from '../../features/@app-core/features/news/screens/NewsScreen';

export default function NewsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Info' }} />
      <PilgrimageNewsScreen />
    </>
  );
}
