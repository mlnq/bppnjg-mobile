import { useRouter } from 'expo-router';

import { PilgrimageConferenceScreen } from '../../features/@app-core/features/conference/screens/PilgrimageConferenceScreen';

export default function ConferenceRoute() {
  const router = useRouter();

  return <PilgrimageConferenceScreen onBack={() => router.push('/')} />;
}
