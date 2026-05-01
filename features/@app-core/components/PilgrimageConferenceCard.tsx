import { Text, TouchableOpacity, View } from 'react-native';
import Footprints from 'lucide-react-native/dist/esm/icons/footprints.mjs';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { getPilgrimageConference, pilgrimageDay } from '../constants/pilgrimageRoute';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageConferenceCardProps = {
  onPress?: () => void;
};

export function PilgrimageConferenceCard({ onPress }: PilgrimageConferenceCardProps) {
  const conference = getPilgrimageConference(pilgrimageDay);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.9 : 1}
      onPress={onPress}
      className="mt-[22px] overflow-hidden rounded-[26px] border px-6 py-6"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#ececf0',
        shadowColor: '#1c2433',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      <View className="flex-row items-start gap-4">
        <View
          className="h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: '#F6DFEA' }}>
          <Footprints size={28} color="#842160" strokeWidth={2.1} />
        </View>
        <View className="flex-1 pr-1">
          <Text
            className="mb-2 text-[12px] font-extrabold uppercase tracking-[1px]"
            style={{ color: '#842160', fontFamily: typography.fontFamily }}>
            {conference.sectionTitle}
          </Text>
          <Text
            className="text-[20px] font-bold leading-8"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {conference.title}
          </Text>
          <Text
            className="mt-4 text-[17px] leading-8"
            style={{ color: '#56637A', fontFamily: typography.fontFamily }}>
            {conference.summary}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
