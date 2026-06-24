import { Stack, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import { HeaderBackButton } from '../../features/@app-core/components/HeaderBackButton';
import { sharedHeaderStyles } from '../../features/@app-core/components/pilgrimage/getStackScreenOptions';
import { PilgrimagePrayerBookEntryScreen } from '../../features/@app-core/features/prayer/screens/PrayerBookEntryScreen';
import {
  getPrayerBookEntryById,
  type PrayerBookEntryId,
} from '../../features/@app-core/features/prayer/helpers/pilgrimagePrayerBook.helpers';

function BackButton() {
  const navigation = useNavigation();
  if (!navigation.canGoBack()) return null;
  return <HeaderBackButton onPress={() => navigation.goBack()} />;
}

export default function PrayerBookEntryRoute() {
  const params = useLocalSearchParams<{ entryId?: string }>();
  const entryId = (params.entryId as PrayerBookEntryId) ?? 'godzinki';
  const entry = getPrayerBookEntryById(entryId);

  return (
    <>
      <Stack.Screen
        options={{
          ...sharedHeaderStyles,
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
          title: entry?.title ?? 'Modlitewnik',
        }}
      />
      <PilgrimagePrayerBookEntryScreen entryId={entryId} />
    </>
  );
}
