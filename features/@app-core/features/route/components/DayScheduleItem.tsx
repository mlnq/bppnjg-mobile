import { View,Text } from 'react-native';

import {
  type PilgrimageDayScheduleItem as PilgrimageDayScheduleItemModel,
} from '../../../constants/pilgrimageRoute';
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { PilgrimageScheduleCard } from './ScheduleCard';
import { PilgrimageScheduleTimeline } from './ScheduleTimeline';

const { colors } = pilgrimageRouteTheme;
const SCHEDULE_TIMELINE = colors.outlineVariant;

type PilgrimageDayScheduleItemProps = {
  item: PilgrimageDayScheduleItemModel;
  currentLocationId: string | null;
  currentLocationSource: 'time-estimated' | 'gps';
};

export function PilgrimageDayScheduleItem({
  item,
  currentLocationId,
  currentLocationSource,
}: PilgrimageDayScheduleItemProps) {
  const isEdgeStop = item.type === 'start' || item.type === 'night';
  const isCurrentStop = currentLocationId !== null && item.id === currentLocationId;
  const accentColor = colors.primary;
  const accentBadgeTextColor = colors.onSurface;
  const timelineColor = SCHEDULE_TIMELINE;

  return (
    <View className="flex-row gap-[14px]">
      <PilgrimageScheduleTimeline
        isCurrentStop={isCurrentStop}
        isEdgeStop={isEdgeStop}
        accentColor={accentColor}
        timelineColor={timelineColor}
      />

      <View className="flex-1 pb-1">
        <PilgrimageScheduleCard
          item={item}
          townName={item.townName ?? item.name ?? 'Nieznana miejscowość'}
          isCurrentStop={isCurrentStop}
          isEdgeStop={isEdgeStop}
          accentColor={accentColor}
          isScheduleEstimated={false}
          accentBadgeTextColor={accentBadgeTextColor}
        />
      </View>
    </View>
  );
}
