import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { formatDurationMinutes } from '../../../utils/formatDurationMinutes';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageScheduleBreakBadgeProps = {
  durationMin: number;
  timelineColor: string;
};

export function PilgrimageScheduleBreakBadge({
  durationMin,
  timelineColor,
}: PilgrimageScheduleBreakBadgeProps) {
  return (
    <View className="flex-row gap-[14px]">
      <View className="w-[54px] items-center">
        <View
          className="absolute inset-y-0 w-[3px]"
          style={{ backgroundColor: timelineColor }}
        />
      </View>
      <View className="flex-1 items-center">
        <View className="mb-5 mt-2 rounded-full px-4 py-2" style={{ backgroundColor: '#FFF1BF' }}>
          <Text
            className="text-[12px] font-bold uppercase"
            style={{ color: '#C96B00', fontFamily: typography.fontFamily }}>
            {`Przerwa ${formatDurationMinutes(durationMin)}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
