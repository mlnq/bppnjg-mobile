import { Text, TouchableOpacity, View, type DimensionValue } from 'react-native';
import ChevronRight from 'lucide-react-native/dist/esm/icons/chevron-right.mjs';
import ChevronLeft from 'lucide-react-native/dist/esm/icons/chevron-left.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { PilgrimageDay } from '../../../constants/pilgrimageRoute';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { getRemainingDistanceFromCurrentLocation } from '../../../utils/pilgrimageCurrentLocation';
import { formatDistanceKm } from '../../../utils/formatters/formatDistanceKm';
import { getPilgrimageRouteLabels } from '../helpers/pilgrimageRouteLabels';

const { colors, typography } = pilgrimageRouteTheme;
const HERO_CARD_BORDER = colors.outlineVariant;
const HERO_CARD_BACKGROUND = colors.surfaceContainerLowest;
const ROUTE_ACCENT = colors.primary;
const ROUTE_ACCENT_SOFT = colors.primaryContainer;

type PilgrimageRouteHeroCardProps = {
  day: PilgrimageDay;
  totalDays: number;
  onOpenInfo: () => void;
  isCurrentDay?: boolean;
  now?: Date;
  onShowPreviousDay?: () => void;
  onShowNextDay?: () => void;
  canShowPreviousDay?: boolean;
  canShowNextDay?: boolean;
};

export function PilgrimageRouteHeroCard({
  day,
  totalDays,
  onOpenInfo,
  isCurrentDay = true,
  now = new Date(),
  onShowPreviousDay,
  onShowNextDay,
  canShowPreviousDay = false,
  canShowNextDay = false,
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
    hasVisibleProgress ? `${Math.max(progressPercent, 14)}%` : '0%'
  ) as DimensionValue;
  const { startLabel, endLabel } = getPilgrimageRouteLabels(day);
  return (
    <View
      className="mt-5 overflow-hidden rounded-[34px] border px-6 py-6"
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
        {canShowPreviousDay ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onShowPreviousDay}
            className="h-[44px] w-[44px] items-center justify-center rounded-full border"
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: HERO_CARD_BORDER,
            }}>
            <ChevronLeft size={18} color={colors.onSurface} strokeWidth={2.1} />
          </TouchableOpacity>
        ) : (
          <View className="h-[44px] w-[44px]" />
        )}

        <View className="mx-3 flex-1 items-center">
          <Text
            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[1px]"
            style={{
              color: ROUTE_ACCENT,
              backgroundColor: ROUTE_ACCENT_SOFT,
              fontFamily: typography.fontFamily,
            }}>
            Dzień {day.dayNumber} z {totalDays}
          </Text>
          <Text
            className="mt-3 text-center text-[30px] font-bold leading-[36px]"
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {startLabel} → {endLabel}
          </Text>
        </View>

        {canShowNextDay ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onShowNextDay}
            className="h-[44px] w-[44px] items-center justify-center rounded-full border"
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: HERO_CARD_BORDER,
            }}>
            <ChevronRight size={18} color={colors.onSurface} strokeWidth={2.1} />
          </TouchableOpacity>
        ) : (
          <View className="h-[44px] w-[44px]" />
        )}
      </View>

      <View className="mt-6 items-center">
        <Text
          className="text-center text-[52px] font-bold leading-[56px]"
          style={{ color: ROUTE_ACCENT, fontFamily: typography.fontFamily }}>
          {formatDistanceKm(remainingDistanceKm)}
        </Text>
        <Text
          className="mt-1 text-center text-[14px] font-bold uppercase tracking-[1px]"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          do celu
        </Text>
      </View>

      {isCurrentDay ? (
        <>
          <View className="mt-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text
                className="text-[12px] font-semibold"
                style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                {formatDistanceKm(walkedDistanceKm)} przebyto
              </Text>
              <Text
                className="text-[12px] font-semibold"
                style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                {formatDistanceKm(remainingDistanceKm)} do celu
              </Text>
            </View>

            <View
              className="relative h-[18px] overflow-hidden rounded-full"
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
          </View>

          {/* <View className="mt-5 flex-row items-center gap-3">
            <View
              className="flex-1 rounded-[20px] px-4 py-4"
              style={{ backgroundColor: STAT_BACKGROUND }}>
              <View className="flex-row items-center gap-2">
                <Footprints size={16} color={ROUTE_ACCENT} strokeWidth={2} />
                <Text
                  className="text-[18px] font-bold"
                  style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
                  {formatDistanceKm(walkedDistanceKm)}
                </Text>
              </View>
              <Text
                className="mt-1 text-[11px] font-semibold uppercase tracking-[0.7px]"
                style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                przebyto
              </Text>
            </View>

            <View
              className="flex-1 rounded-[20px] px-4 py-4"
              style={{ backgroundColor: STAT_BACKGROUND }}>
              <View className="flex-row items-center gap-2">
                <Clock3 size={16} color={ROUTE_ACCENT} strokeWidth={2} />
                <Text
                  className="text-[18px] font-bold"
                  style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
                  {estimatedDurationLabel}
                </Text>
              </View>
              <Text
                className="mt-1 text-[11px] font-semibold uppercase tracking-[0.7px]"
                style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                szacowany czas
              </Text>
            </View>
          </View> */}
        </>
      ) : null}

      {/*{isCurrentDay ? (*/}
      {/*  <TouchableOpacity*/}
      {/*    activeOpacity={0.8}*/}
      {/*    onPress={onOpenInfo}*/}
      {/*    className="mt-5 rounded-[20px] border px-4 py-4"*/}
      {/*    style={{*/}
      {/*      backgroundColor: colors.surfaceContainerLowest,*/}
      {/*      borderColor: HERO_CARD_BORDER,*/}
      {/*    }}>*/}
      {/*    <View className="flex-row items-center gap-3">*/}
      {/*      <MapPinned size={18} color={ROUTE_ACCENT} strokeWidth={1.9} />*/}
      {/*      <Text*/}
      {/*        className="flex-1 text-[14px] font-semibold"*/}
      {/*        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>*/}
      {/*        Jak wyznaczamy pozycję na trasie?*/}
      {/*      </Text>*/}
      {/*      <ChevronRight size={18} color={colors.onSurface} strokeWidth={2} />*/}
      {/*    </View>*/}
      {/*  </TouchableOpacity>*/}
      {/*) : null}*/}
    </View>
  );
}
