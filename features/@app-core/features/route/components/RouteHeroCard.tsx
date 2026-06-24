import { Text, type DimensionValue, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { PilgrimageDay } from '../../../constants/pilgrimageRoute';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { getRemainingDistanceFromCurrentLocation } from '../../../utils/pilgrimageCurrentLocation';
import { getPilgrimageRouteLabels } from '../helpers/pilgrimageRouteLabels';

const { colors, typography } = pilgrimageRouteTheme;
const HERO_CARD_BORDER = colors.outlineVariant;
const HERO_CARD_BACKGROUND = colors.surfaceContainerLowest;
const ROUTE_ACCENT = colors.primary;
const ROUTE_ACCENT_SOFT = colors.primaryContainer;

type PilgrimageRouteHeroCardProps = {
  day: PilgrimageDay;
  totalDays: number;
  isCurrentDay?: boolean;
  now?: Date;
};

function formatDayDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function formatDistanceNumber(km: number): string {
  const rounded = Math.round(km * 100) / 100;
  return rounded.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function PilgrimageRouteHeroCard({
  day,
  totalDays,
  isCurrentDay = true,
  now = new Date(),
}: PilgrimageRouteHeroCardProps) {
  const { currentLocation, locationSource } = useUserLocation();
  const remainingDistanceKm = isCurrentDay
    ? getRemainingDistanceFromCurrentLocation({
        day,
        currentLocation,
        now,
        locationSource,
      })
    : day.route.totalDistanceKm;
  const walkedDistanceKm = Math.max(0, day.route.totalDistanceKm - remainingDistanceKm);
  const progressPercent = Math.max(
    0,
    Math.min(100, (walkedDistanceKm / Math.max(day.route.totalDistanceKm, 1)) * 100)
  );
  const hasVisibleProgress = progressPercent > 0;
  const roundedProgressPercent = Math.round(progressPercent);
  const progressFillWidth = (
    hasVisibleProgress ? `${Math.max(progressPercent, 10)}%` : '0%'
  ) as DimensionValue;
  const { startLabel, endLabel } = getPilgrimageRouteLabels(day);
  const dateLabel = formatDayDate(day.date);

  return (
    <View
      className="overflow-hidden rounded-[28px] border px-6 py-6"
      style={{
        backgroundColor: HERO_CARD_BACKGROUND,
        borderColor: HERO_CARD_BORDER,
        shadowColor: colors.onSurface,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      <View className="flex-row items-center justify-between">
        <Text
          className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[1px]"
          style={{
            color: ROUTE_ACCENT,
            backgroundColor: ROUTE_ACCENT_SOFT,
            fontFamily: typography.fontFamily,
          }}>
          Etap {day.dayNumber} z {totalDays}
        </Text>
        <Text
          className="text-[13px]"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          {dateLabel}
        </Text>
      </View>

      <View className="mt-5 flex-row items-baseline gap-1">
        <Text
          className="text-[64px] font-bold leading-[68px]"
          style={{ color: ROUTE_ACCENT, fontFamily: typography.fontFamily }}>
          {formatDistanceNumber(remainingDistanceKm)}
        </Text>
        <Text
          className="text-[28px] font-bold"
          style={{ color: ROUTE_ACCENT, fontFamily: typography.fontFamily }}>
          km
        </Text>
      </View>
      <Text
        className="mt-1 text-[12px] font-bold uppercase tracking-[1.2px]"
        style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
        do celu
      </Text>

      <Text
        className="mt-4 text-[26px] font-bold leading-[32px]"
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        {startLabel} → {endLabel}
      </Text>

      {isCurrentDay ? (
        <>
          <View
            className="relative mt-5 h-[18px] overflow-hidden rounded-full"
            style={{ backgroundColor: colors.surfaceContainerLow }}>
            {hasVisibleProgress ? (
              <View
                className="h-full rounded-full"
                style={{ width: progressFillWidth, backgroundColor: ROUTE_ACCENT }}
              />
            ) : null}
            <View className="absolute inset-y-0 left-0 justify-center px-3">
              <Text
                className="text-[11px] font-bold"
                style={{
                  color: hasVisibleProgress ? colors.onPrimary : colors.onSurfaceVariant,
                  fontFamily: typography.fontFamily,
                }}>
                {roundedProgressPercent}%
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row justify-between">
            <Text
              className="text-[12px] font-semibold"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {formatDistanceNumber(walkedDistanceKm)} km przebyto
            </Text>
            <Text
              className="text-[12px] font-semibold"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {formatDistanceNumber(remainingDistanceKm)} km do celu
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}
