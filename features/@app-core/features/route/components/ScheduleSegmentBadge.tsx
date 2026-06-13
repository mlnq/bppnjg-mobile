import { Text, View } from 'react-native';
import Footprints from 'lucide-react-native/dist/esm/icons/footprints.mjs';
import Timer from 'lucide-react-native/dist/esm/icons/timer.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { formatDistanceKm } from '../../../utils/formatters/formatDistanceKm';
import { formatDurationMinutes } from '../../../utils/formatters/formatDurationMinutes';

const { colors, typography } = pilgrimageRouteTheme;
const SEGMENT_TEXT_COLOR = colors.primary;
const SEGMENT_TIMELINE_COLOR = colors.surfaceContainerHigh;

type PilgrimageScheduleSegmentBadgeProps = {
  distanceToNextKm: number;
  durationMin?: number;
  accentColor?: string;
};

export function PilgrimageScheduleSegmentBadge({
  distanceToNextKm,
  durationMin = 0,
  accentColor = SEGMENT_TEXT_COLOR,
}: PilgrimageScheduleSegmentBadgeProps) {
  return (
    <View className="flex-row gap-[14px]">
      <View className="w-[40px] items-center">
        <View
          className="absolute inset-y-0 w-[3px]"
          style={{ backgroundColor: SEGMENT_TIMELINE_COLOR }}
        />
      </View>
      <View className="flex-1 items-center">
        <View className="mb-5 mt-2 flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {distanceToNextKm > 0 ?<View className="flex-row items-center">
            <Footprints size={16} color={accentColor} strokeWidth={2.1}/>
            <Text
                className="ml-2 text-[13px] font-extrabold uppercase tracking-[1px]"
                style={{color: accentColor, fontFamily: typography.fontFamily}}>
              {formatDistanceKm(distanceToNextKm)}
            </Text>
          </View>:null}
        </View>
      </View>
    </View>
  );
}
