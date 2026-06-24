import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { PilgrimageDay } from '../../../constants/pilgrimageRoute';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { getCurrentRouteLocation } from '../../../utils/pilgrimageCurrentLocation';
import { PilgrimageDayScheduleItem } from './DayScheduleItem';
import { PilgrimageScheduleSegmentBadge } from './ScheduleSegmentBadge';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageDayScheduleProps = {
  day: PilgrimageDay;
  isCurrentDay?: boolean;
  now?: Date;
};

function isRenderableScheduleItem(item: PilgrimageDay['schedule'][number]) {
  const townName = item.townName ?? '';
  const hasRealTownName = townName.trim() !== '' && !/^Punkt \d+$/.test(townName);
  const hasRealTitle = typeof item.title === 'string' && item.title.trim() !== '';
  const hasRealNote = typeof item.note === 'string' && item.note.trim() !== '';

  return hasRealTownName || hasRealTitle || hasRealNote;
}

function getScheduleItemRenderKey(item: PilgrimageDay['schedule'][number], index: number) {
  return `${item.id}:${item.waypointId}:${item.time}:${index}`;
}

function getVisibleCurrentLocationId(
  schedule: PilgrimageDay['schedule'],
  currentLocationId: string | null
) {
  if (!currentLocationId) {
    return null;
  }

  const currentIndex = schedule.findIndex((item) => item.id === currentLocationId);

  if (currentIndex === -1) {
    return null;
  }

  for (let index = currentIndex; index >= 0; index -= 1) {
    if (isRenderableScheduleItem(schedule[index])) {
      return schedule[index].id;
    }
  }

  for (let index = currentIndex + 1; index < schedule.length; index += 1) {
    if (isRenderableScheduleItem(schedule[index])) {
      return schedule[index].id;
    }
  }

  return null;
}

export function PilgrimageDaySchedule({
  day,
  isCurrentDay = true,
  now = new Date(),
}: PilgrimageDayScheduleProps) {
  const { currentLocation, locationSource } = useUserLocation();
  const currentRouteLocation = isCurrentDay
    ? getCurrentRouteLocation(day, currentLocation, now, locationSource)
    : null;
  const currentVisibleLocationId = getVisibleCurrentLocationId(
    day.schedule,
    currentRouteLocation?.location.id ?? null
  );
  const scheduleAccentColor = colors.primary;
  const visibleSchedule = day.schedule.filter(isRenderableScheduleItem);

  return (
    <View className="mt-[34px]">
      <View className="mb-[18px] flex-row items-center justify-between">
        <Text
          className="text-[22px] font-bold"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          Plan dnia
        </Text>
      </View>

      <View>
        {visibleSchedule.map((item, index) => (
          <View key={getScheduleItemRenderKey(item, index)} className="relative">
            <PilgrimageDayScheduleItem
              item={item}
              currentLocationId={currentVisibleLocationId}
              currentLocationSource={currentRouteLocation?.source ?? 'time-estimated'}
            />
            <PilgrimageScheduleSegmentBadge
              distanceToNextKm={item.distanceToNextKm}
              durationMin={item.durationMin}
              accentColor={scheduleAccentColor}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
