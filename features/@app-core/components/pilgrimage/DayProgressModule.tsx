import Svg, { Circle } from 'react-native-svg';
import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../packages/@app-ui';
import type { PilgrimageDay } from '../../constants/pilgrimageRoute';
import { useUserLocation } from '../../hooks/useUserLocation';
import { getRemainingDistanceFromCurrentLocation } from '../../utils/pilgrimageCurrentLocation';

const { colors, typography } = pilgrimageRouteTheme;

const SIZE = 232;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type PilgrimageDayProgressModuleProps = {
  day: PilgrimageDay;
  totalDays: number;
  accentSource?: 'time-estimated' | 'gps';
};

function formatDistance(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function PilgrimageDayProgressModule({
  day,
  totalDays,
  accentSource = 'gps',
}: PilgrimageDayProgressModuleProps) {
  const { currentLocation, locationSource } = useUserLocation();
  const remainingDistanceKm = getRemainingDistanceFromCurrentLocation({
    day,
    currentLocation,
    locationSource,
  });
  const walkedDistanceKm = Math.max(0, day.route.totalDistanceKm - remainingDistanceKm);
  const progressPercent = Math.max(
    0,
    Math.min(100, (walkedDistanceKm / Math.max(day.route.totalDistanceKm, 1)) * 100)
  );

  const startStop = day.schedule[0];
  const endStop = day.schedule[day.schedule.length - 1];
  const isScheduleEstimated = accentSource === 'time-estimated';
  const accentColor = isScheduleEstimated ? colors.secondary : colors.primary;
  const trackColor = isScheduleEstimated ? colors.secondaryContainer : colors.primaryContainer;

  const strokeDashoffset = CIRCUMFERENCE - (progressPercent / 100) * CIRCUMFERENCE;

  return (
    <View className="mt-6">
      <Text
        className="mb-2 text-sm font-semibold"
        style={{ color: accentColor, fontFamily: typography.fontFamily, letterSpacing: 0.8 }}>
        DZIEŃ {day.dayNumber} Z {totalDays} {day.title.toUpperCase()}
      </Text>
      <Text
        className="mb-5 text-[28px] font-bold leading-10"
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        {startStop?.townName ?? startStop?.name ?? 'Brak startu'} →{'\n'}
        {endStop?.townName ?? endStop?.name ?? 'Brak celu dnia'}
      </Text>

      <View className="px-1 py-1">
        <View className="items-center">
          <View
            className="relative items-center justify-center"
            style={{ width: SIZE, height: SIZE }}>
            <Svg
              width={SIZE}
              height={SIZE}
              style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={trackColor}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={accentColor}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </Svg>

            <View className="items-center justify-center">
              <Text
                className="text-[52px] font-bold"
                style={{ color: accentColor, fontFamily: typography.fontFamily }}>
                {formatDistance(remainingDistanceKm)}
              </Text>
              <Text
                className="mt-[-4px] text-[16px] font-bold uppercase tracking-[1.4px]"
                style={{ color: accentColor, fontFamily: typography.fontFamily }}>
                km do celu
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4 items-center">
          <Text
            className="text-[15px] font-medium"
            style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
            Przeszłeś już{' '}
            <Text
              className="font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {formatDistance(walkedDistanceKm)} km
            </Text>{' '}
            z{' '}
            <Text
              className="font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {formatDistance(day.route.totalDistanceKm)} km
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
