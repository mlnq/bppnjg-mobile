import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import { HeaderBackButton } from '../../features/@app-core/components/HeaderBackButton';
import { sharedHeaderStyles } from '../../features/@app-core/components/pilgrimage/getStackScreenOptions';
import { PilgrimagePrayerBookScreen } from '../../features/@app-core/features/prayer/screens/PrayerBookScreen';

function BackButton() {
  const navigation = useNavigation();
  if (!navigation.canGoBack()) return null;
  return <HeaderBackButton onPress={() => navigation.goBack()} />;
}

export default function PrayerBookRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          ...sharedHeaderStyles,
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
          title: 'Modlitewnik',
        }}
      />
      <PilgrimagePrayerBookScreen />
    </>
  );
}
