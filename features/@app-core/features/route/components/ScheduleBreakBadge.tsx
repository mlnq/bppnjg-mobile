import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { formatDurationMinutes } from '../../../utils/formatters/formatDurationMinutes';

const { colors, typography } = pilgrimageRouteTheme;
const BREAK_TEXT_COLOR = colors.primary;
const BREAK_TIMELINE_COLOR = colors.surfaceContainerHigh;

type PilgrimageScheduleBreakBadgeProps = {
  durationMin: number;
  accentColor?: string;
};

export function PilgrimageScheduleBreakBadge({
  durationMin,
  accentColor = BREAK_TEXT_COLOR,
}: PilgrimageScheduleBreakBadgeProps) {
  return (
    <View className="flex-row gap-[14px]">
      <View className="w-[40px] items-center">
        <View
          className="absolute inset-y-0 w-[3px]"
          style={{ backgroundColor: BREAK_TIMELINE_COLOR }}
        />
      </View>
      <View className="flex-1 items-center">
        <Text
          className="mb-5 mt-2 text-[13px] font-extrabold uppercase tracking-[1px]"
          style={{ color: accentColor, fontFamily: typography.fontFamily }}>
          {`Przerwa ${formatDurationMinutes(durationMin)}`}
        </Text>
      </View>
    </View>
  );
}
