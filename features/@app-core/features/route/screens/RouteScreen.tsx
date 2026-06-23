import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

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
import { PilgrimageRoutePositionBadge } from '../components/RoutePositionBadge';
import { getRouteLocationMeta } from '../helpers/pilgrimageRouteLocationMeta';

const { colors, typography } = pilgrimageRouteTheme;
const ROUTE_CHIP_BACKGROUND = colors.surfaceContainerLowest;
const ROUTE_CHIP_BORDER = colors.primaryContainer;
const ROUTE_CHIP_TEXT = colors.primary;

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

  const {
    currentRouteLocation,
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

  return (
    <>
      <AppScreenScrollView
        className="flex-1"
        style={{ backgroundColor: AppColors.background }}
        contentContainerClassName="pt-2 pb-6"
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
        {isCurrentDay ? (
          <PilgrimageRoutePositionBadge
            label={
              currentRouteLocation.source === 'gps' ? 'Lokalizacja wg GPS' : 'Według harmonogramu'
            }
            onPress={() => {
              setIsInfoModalVisible(true);
            }}
          />
        ) : null}
        {isCurrentDay && isScheduleEstimated ? (
          <View
            className="mt-3 self-start rounded-full border px-4 py-3"
            style={{ backgroundColor: ROUTE_CHIP_BACKGROUND, borderColor: ROUTE_CHIP_BORDER }}>
            <Text
              className="text-[12px] font-bold uppercase tracking-[0.8px]"
              style={{ color: ROUTE_CHIP_TEXT, fontFamily: typography.fontFamily }}>
              {isForcedTimeMode
                ? 'Tryb godzinowy włączony. Pokazujemy pozycję według harmonogramu.'
                : 'GPS wyłączony. Pokazujemy pozycję według harmonogramu.'}
            </Text>
          </View>
        ) : null}
        {!isCurrentDay ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              resetToCurrentDay();
            }}
            className="mt-3 self-start rounded-full border px-4 py-3"
            style={{ backgroundColor: ROUTE_CHIP_BACKGROUND, borderColor: ROUTE_CHIP_BORDER }}>
            <Text
              className="text-[12px] font-bold uppercase tracking-[0.8px]"
              style={{ color: ROUTE_CHIP_TEXT, fontFamily: typography.fontFamily }}>
              Powrót do bieżącego dnia
            </Text>
          </TouchableOpacity>
        ) : null}
        <PilgrimageRouteHeroCard
          day={activeDay}
          totalDays={pilgrimage.totalDays}
          now={now}
          onOpenInfo={() => {
            setIsInfoModalVisible(true);
          }}
          isCurrentDay={isCurrentDay}
          canShowPreviousDay={canShowPreviousDay}
          canShowNextDay={canShowNextDay}
          onShowPreviousDay={() => {
            if (canShowPreviousDay) {
              setSelectedDayNumber(activeDay.dayNumber - 1);
            }
          }}
          onShowNextDay={() => {
            if (canShowNextDay) {
              setSelectedDayNumber(activeDay.dayNumber + 1);
            }
          }}
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
