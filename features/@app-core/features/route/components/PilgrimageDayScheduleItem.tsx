import { View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import {
  getTownById,
  getWaypointById,
  type PilgrimageDay,
  type PilgrimageDayScheduleItem as PilgrimageDayScheduleItemModel,
  type Town,
} from '../../../constants/pilgrimageRoute';
import { PilgrimageScheduleCard } from './PilgrimageScheduleCard';
import { PilgrimageScheduleTimeline } from './PilgrimageScheduleTimeline';

const { colors } = pilgrimageRouteTheme;

type PilgrimageDayScheduleItemProps = {
  day: PilgrimageDay;
  towns: readonly Town[];
  item: PilgrimageDayScheduleItemModel;
  currentLocationId: string;
  currentLocationSource: 'time-estimated' | 'gps';
};

export function PilgrimageDayScheduleItem({
  day,
  towns,
  item,
  currentLocationId,
  currentLocationSource,
}: PilgrimageDayScheduleItemProps) {
  const isEdgeStop = item.type === 'start' || item.type === 'night';
  const waypoint = getWaypointById(day.route, item.waypointId);
  const town = waypoint ? getTownById(waypoint.townId, towns) : undefined;
  const isCurrentStop = town?.id === currentLocationId;
  const isScheduleEstimated = currentLocationSource === 'time-estimated';
  const accentColor = isScheduleEstimated ? colors.secondary : colors.primary;
  const accentBadgeTextColor = isScheduleEstimated ? colors.onSecondary : colors.onPrimary;
  const currentStopBadgeLabel =
    currentLocationSource === 'gps' ? 'W okolicy (GPS)' : 'Według harmonogramu';
  const timelineColor = isScheduleEstimated ? '#f1d98b' : '#dfb6cb';

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
          townName={town?.name ?? 'Nieznana miejscowość'}
          isCurrentStop={isCurrentStop}
          isEdgeStop={isEdgeStop}
          accentColor={accentColor}
          accentBadgeTextColor={accentBadgeTextColor}
          currentStopBadgeLabel={currentStopBadgeLabel}
        />
      </View>
    </View>
  );
}
