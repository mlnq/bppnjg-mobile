import { View } from 'react-native';
import Footprints from 'lucide-react-native/dist/esm/icons/footprints.mjs';
import MapPinned from 'lucide-react-native/dist/esm/icons/map-pinned.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';

const { colors } = pilgrimageRouteTheme;

type PilgrimageScheduleTimelineProps = {
  isCurrentStop: boolean;
  isEdgeStop: boolean;
  accentColor: string;
  timelineColor: string;
};

export function PilgrimageScheduleTimeline({
  isCurrentStop,
  isEdgeStop,
  accentColor,
  timelineColor,
}: PilgrimageScheduleTimelineProps) {
  const markerSize = isCurrentStop ? 56 : 44;
  const markerStyle = isCurrentStop
    ? {
        width: markerSize,
        height: markerSize,
        backgroundColor: colors.surfaceContainerLowest,
        borderColor: colors.surfaceContainerLowest,
        borderWidth: 0,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 6,
      }
    : {
        width: markerSize,
        height: markerSize,
        backgroundColor: '#ffffff',
        borderColor: '#F2C8DA',
        borderWidth: 3,
      };

  return (
    <View className="w-[54px] items-center">
      <View
        className="absolute bottom-[-18px] top-0 w-[3px]"
        style={{ backgroundColor: '#F2C8DA' }}
      />
      <View className="z-[1] mt-[12px] items-center justify-center rounded-full" style={markerStyle}>
        {isCurrentStop ? (
          <Footprints size={26} color={accentColor} strokeWidth={2.1} />
        ) : (
          <MapPinned size={22} color={accentColor} strokeWidth={2.1} />
        )}
      </View>
    </View>
  );
}
