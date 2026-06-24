import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import ChevronLeft from 'lucide-react-native/dist/esm/icons/chevron-left.mjs';
import ChevronRight from 'lucide-react-native/dist/esm/icons/chevron-right.mjs';
import Route from 'lucide-react-native/dist/esm/icons/route.mjs';

import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { PilgrimageRouteLocationInfoModal } from '../../../components/pilgrimage/RouteLocationInfoModal';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { SCREEN_HORIZONTAL_PADDING_CLASS } from '../../../constants/layout';
import { useCurrentTime } from '../../../hooks/useCurrentTime';
import { usePilgrimageRefresh } from '../../../hooks/usePilgrimageRefresh';
import { useSelectedPilgrimageDay } from '../../../hooks/useSelectedPilgrimageDay';
import { useUserLocation } from '../../../hooks/useUserLocation';
import {
  PILGRIMAGE_YEAR,
  useGetPilgrimageDayQuery,
  useGetPilgrimageQuery,
} from '../../../services/pilgrimageApi';
import { PilgrimageDaySchedule } from '../components/DaySchedule';
import { PilgrimageRouteHeroCard } from '../components/RouteHeroCard';
import { getRouteLocationMeta } from '../helpers/pilgrimageRouteLocationMeta';
import { getPilgrimageRouteLabels } from '../helpers/pilgrimageRouteLabels';

const { colors, typography } = pilgrimageRouteTheme;
const NAV_BUTTON_BORDER = colors.outlineVariant;
const BANNER_BACKGROUND = colors.surfaceContainerLowest;
const BANNER_BORDER = colors.primaryContainer;

export function PilgrimageRouteScreen() {
  const { currentLocation, locationSource } = useUserLocation();
  const now = useCurrentTime();
  const {
    data: pilgrimage,
    isLoading: isPilgrimageLoading,
    isFetching: isPilgrimageFetching,
    isError: isPilgrimageError,
  } = useGetPilgrimageQuery(PILGRIMAGE_YEAR);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const { currentDayFetchNumber, effectiveDayNumber, setSelectedDayNumber, resetToCurrentDay } =
    useSelectedPilgrimageDay(
      pilgrimage
        ? {
            totalDays: pilgrimage.totalDays,
          }
        : null
    );
  const activeDayNumber = effectiveDayNumber ?? currentDayFetchNumber;
  const {
    data: activeDay,
    isLoading: isDayLoading,
    isFetching: isDayFetching,
    isError: isDayError,
    refetch: refetchActiveDay,
  } = useGetPilgrimageDayQuery(
    {
      year: PILGRIMAGE_YEAR,
      dayNumber: activeDayNumber ?? 1,
    },
    {
      skip: activeDayNumber === null,
    }
  );
  const { isRefreshing: isManualRefreshing, refresh: handleRefresh } = usePilgrimageRefresh({
    additionalRefreshTasks: activeDayNumber !== null ? [() => refetchActiveDay()] : [],
  });

  if (
    (!pilgrimage || !activeDay) &&
    (isPilgrimageLoading ||
      isPilgrimageFetching ||
      (activeDayNumber !== null && (isDayLoading || isDayFetching)))
  ) {
    return (
      <View
        className={`flex-1 ${SCREEN_HORIZONTAL_PADDING_CLASS}`}
        style={{ backgroundColor: AppColors.background }}>
        <AppLoader label="Pobieranie danych etapu z backendu..." minHeight={320} />
      </View>
    );
  }

  if (!pilgrimage || !activeDay) {
    return (
      <AppScreenScrollView
        className="flex-1"
        style={{ backgroundColor: AppColors.background }}
        contentContainerClassName="pt-8 pb-6"
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor={colors.primary}
          />
        }>
        <Text
          className="text-[16px] leading-7"
          style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
          Nie udało się pobrać harmonogramu dnia z backendu.
        </Text>
      </AppScreenScrollView>
    );
  }

  const isCurrentDay =
    currentDayFetchNumber !== null && activeDay.dayNumber === currentDayFetchNumber;
  const canShowPreviousDay = activeDay.dayNumber > 1;
  const canShowNextDay = activeDay.dayNumber < pilgrimage.totalDays;
  const { startLabel, endLabel } = getPilgrimageRouteLabels(activeDay);

  const {
    scheduleSourceLabel,
    isScheduleEstimated,
    isForcedTimeMode,
    modalDescription,
  } = getRouteLocationMeta({
    day: activeDay,
    currentLocation,
    locationSource,
    now,
  });

  const gpsBannerText = isCurrentDay && isScheduleEstimated
    ? isForcedTimeMode
      ? 'Tryb godzinowy — pozycja według harmonogramu'
      : 'GPS wyłączony — pokazujemy pozycję według harmonogramu'
    : null;

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: AppColors.background }}>
        <View
          className={`flex-row items-center px-5 py-3`}
          style={{ backgroundColor: AppColors.background }}>
          {canShowPreviousDay ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedDayNumber(activeDay.dayNumber - 1)}
              className="h-[44px] w-[44px] items-center justify-center rounded-full border"
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                borderColor: NAV_BUTTON_BORDER,
              }}>
              <ChevronLeft size={18} color={colors.onSurface} strokeWidth={2.1} />
            </TouchableOpacity>
          ) : (
            <View className="h-[44px] w-[44px]" />
          )}

          <View className="flex-1 items-center">
            <Text
              className="text-[17px] font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              Dzień {activeDay.dayNumber} z {pilgrimage.totalDays}
            </Text>
            <Text
              className="mt-[2px] text-[13px]"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {startLabel} → {endLabel}
            </Text>
          </View>

          {canShowNextDay ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedDayNumber(activeDay.dayNumber + 1)}
              className="h-[44px] w-[44px] items-center justify-center rounded-full border"
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                borderColor: NAV_BUTTON_BORDER,
              }}>
              <ChevronRight size={18} color={colors.onSurface} strokeWidth={2.1} />
            </TouchableOpacity>
          ) : (
            <View className="h-[44px] w-[44px]" />
          )}
        </View>

        <AppScreenScrollView
          className="flex-1"
          style={{ backgroundColor: AppColors.background }}
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isManualRefreshing}
              onRefresh={() => {
                void handleRefresh();
              }}
              tintColor={colors.primary}
            />
          }>
          {gpsBannerText ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsInfoModalVisible(true)}
              className="mb-3 flex-row items-center rounded-2xl border px-4 py-3"
              style={{ backgroundColor: BANNER_BACKGROUND, borderColor: BANNER_BORDER }}>
              <Route size={16} color={colors.primary} strokeWidth={2} />
              <Text
                className="ml-3 flex-1 text-[11px] font-bold uppercase tracking-[0.7px]"
                style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
                {gpsBannerText}
              </Text>
            </TouchableOpacity>
          ) : null}

          {!isCurrentDay ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => resetToCurrentDay()}
              className="mb-3 flex-row items-center justify-center rounded-2xl px-4 py-3"
              style={{ backgroundColor: colors.primary }}>
              <Text
                className="text-[11px] font-bold uppercase tracking-[0.7px]"
                style={{ color: colors.onPrimary, fontFamily: typography.fontFamily }}>
                Powrót do bieżącego dnia
              </Text>
            </TouchableOpacity>
          ) : null}

          <PilgrimageRouteHeroCard
            day={activeDay}
            totalDays={pilgrimage.totalDays}
            now={now}
            isCurrentDay={isCurrentDay}
          />

          {isPilgrimageError || isDayError ? (
            <Text
              className="mt-4 text-[12px] font-medium uppercase tracking-[0.8px]"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              Wyświetlane są ostatnio zapisane dane.
            </Text>
          ) : null}

          <PilgrimageDaySchedule day={activeDay} isCurrentDay={isCurrentDay} now={now} />
        </AppScreenScrollView>
      </View>

      <PilgrimageRouteLocationInfoModal
        visible={isInfoModalVisible}
        modalDescription={modalDescription}
        scheduleSourceLabel={scheduleSourceLabel}
        onClose={() => {
          setIsInfoModalVisible(false);
        }}
      />
    </>
  );
}
