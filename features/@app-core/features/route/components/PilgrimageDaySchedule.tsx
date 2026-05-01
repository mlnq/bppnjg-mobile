import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { PilgrimageDay, Town } from '../../../constants/pilgrimageRoute';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { getCurrentRouteLocation } from '../../../utils/pilgrimageCurrentLocation';
import { PilgrimageDayScheduleItem } from './PilgrimageDayScheduleItem';
import { PilgrimageScheduleBreakBadge } from './PilgrimageScheduleBreakBadge';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageDayScheduleProps = {
  day: PilgrimageDay;
  towns: readonly Town[];
};

export function PilgrimageDaySchedule({ day, towns }: PilgrimageDayScheduleProps) {
  const { currentLocation } = useUserLocation();
  const currentRouteLocation = getCurrentRouteLocation(day, currentLocation, towns);
  const timelineColor = '#F2C8DA';

  return (
    <View className="mt-[34px]">
      <View className="mb-[18px] flex-row items-center justify-between">
        <Text
          className="text-[22px] font-bold"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          Harmonogram Dnia
        </Text>
      </View>

      <View className="relative">
        {day.schedule.map((item, index) => (
          <View key={item.id} className="relative">
            {index > 0 && item.durationMin > 0 ? (
              <PilgrimageScheduleBreakBadge
                durationMin={item.durationMin}
                timelineColor={timelineColor}
              />
            ) : null}
            <PilgrimageDayScheduleItem
              day={day}
              towns={towns}
              item={item}
              currentLocationId={currentRouteLocation.location.id}
              currentLocationSource={currentRouteLocation.source}
            />
            {index < day.schedule.length - 1 ? <View className="h-2" /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}
