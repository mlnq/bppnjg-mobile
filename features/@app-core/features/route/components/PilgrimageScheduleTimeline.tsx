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
  const inactiveTimelineColor = colors.surfaceContainerHigh;
  const inactiveMarkerColor = colors.onSurfaceVariant;
  const activeMarkerBackground = colors.surfaceContainerLowest;
  const activeMarkerBorder = colors.outlineVariant;
  const markerSize = isCurrentStop ? 44 : 22;
  const markerStyle = isCurrentStop
    ? {
        width: markerSize,
        height: markerSize,
        backgroundColor: activeMarkerBackground,
        borderColor: activeMarkerBorder,
        borderWidth: 1,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
      }
    : {
        width: markerSize,
        height: markerSize,
        backgroundColor: colors.surfaceContainerLowest,
        borderColor: inactiveTimelineColor,
        borderWidth: 2,
      };

  return (
    <View className="w-[40px] items-center">
      <View
        className="absolute bottom-[-18px] top-0 w-[3px]"
        style={{ backgroundColor: inactiveTimelineColor }}
      />
      <View
        className="z-[1] mt-[18px] items-center justify-center rounded-full"
        style={markerStyle}>
        {isCurrentStop ? (
          <Footprints size={20} color={accentColor} strokeWidth={2.5} />
        ) : (
         null
        )}
      </View>
    </View>
  );
}
