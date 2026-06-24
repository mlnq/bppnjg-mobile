import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../packages/@app-ui';
import type { PilgrimageDay } from '../../constants/pilgrimageRoute';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import { useUserLocation } from '../../hooks/useUserLocation';
import {
  getCurrentRouteLocation,
  getRemainingDistanceFromCurrentLocation,
} from '../../utils/pilgrimageCurrentLocation';
import { PilgrimageRemainingDistanceNote } from './RemainingDistanceNote';

const { colors, radii, typography } = pilgrimageRouteTheme;

type PilgrimageDaySummaryProps = {
  day: PilgrimageDay;
  totalDays: number;
  accentSource?: 'time-estimated' | 'gps';
};

export function PilgrimageDaySummary({
  day,
  totalDays,
  accentSource = 'gps',
}: PilgrimageDaySummaryProps) {
  const { currentLocation, locationSource } = useUserLocation();
  const now = useCurrentTime();
  const remainingDistanceKm = getRemainingDistanceFromCurrentLocation({
    day,
    currentLocation,
    now,
    locationSource,
  });
  const currentRouteLocation = getCurrentRouteLocation(day, currentLocation, now, locationSource);
  const progressPercent = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        ((day.route.totalDistanceKm - remainingDistanceKm) /
          Math.max(day.route.totalDistanceKm, 1)) *
          100
      )
    )
  );
  const startStop = day.schedule[0];
  const endStop = day.schedule[day.schedule.length - 1];
  const isScheduleEstimated = accentSource === 'time-estimated';
  const accentColor = isScheduleEstimated ? colors.secondary : colors.primary;
  const accentBorderColor = isScheduleEstimated
    ? colors.secondaryContainer
    : colors.primaryContainer;
  const progressColor = accentColor;

  return (
    <View className="mt-6">
      <Text
        className="mb-2 text-sm font-semibold"
        style={{ color: accentColor, fontFamily: typography.fontFamily, letterSpacing: 0.8 }}>
        DZIEŃ {day.dayNumber} Z {totalDays} {day.title.toUpperCase()}
      </Text>
      <Text
        className="mb-[18px] text-[28px] font-bold leading-10"
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        {startStop?.townName ?? startStop?.name ?? 'Brak startu'} →{'\n'}
        {endStop?.townName ?? endStop?.name ?? 'Brak celu dnia'}
      </Text>

      <View
        className="rounded-xl border px-[18px] py-5"
        style={{
          backgroundColor: colors.surfaceContainerLowest,
          borderColor: accentBorderColor,
          borderRadius: radii.md,
        }}>
        <View className="mb-[18px] flex-row justify-between">
          <View className="flex-1 gap-1">
            <Text
              className="text-[14px] leading-[18px]"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              Zostało do celu
            </Text>
            <Text
              className="text-[17px] font-bold leading-6"
              style={{ color: accentColor, fontFamily: typography.fontFamily }}>
              {remainingDistanceKm.toFixed(1)} km
            </Text>
            <PilgrimageRemainingDistanceNote
              remainingDistanceKm={remainingDistanceKm}
              fallbackReason={currentRouteLocation.fallbackReason}
              source={currentRouteLocation.source}
            />
          </View>
          <View className="flex-1 gap-1">
            <Text
              className="text-[13px] leading-[18px]"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              Całkowity dystans dnia
            </Text>
            <Text
              className="text-[17px] font-bold leading-6"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {day.route.totalDistanceKm.toFixed(1)} km
            </Text>
          </View>
        </View>

        <View
          className="h-[10px] overflow-hidden rounded-full"
          style={{ backgroundColor: colors.surfaceContainerHigh, borderRadius: radii.full }}>
          <View
            className="h-full rounded-full"
            style={{
              backgroundColor: progressColor,
              borderRadius: radii.full,
              width: `${progressPercent}%`,
            }}
          />
        </View>

        <View className="mt-3 flex-row justify-between">
          <Text
            className="text-[11px] font-bold"
            style={{
              color: colors.onSurfaceVariant,
              fontFamily: typography.fontFamily,
              letterSpacing: 1.2,
            }}>
            START: {day.route.scheduledStartTime}
          </Text>
          <Text
            className="text-[11px] font-bold"
            style={{
              color: colors.onSurfaceVariant,
              fontFamily: typography.fontFamily,
              letterSpacing: 1.2,
            }}>
            PLAN: {day.route.plannedArrivalTime}
          </Text>
        </View>
      </View>
    </View>
  );
}
