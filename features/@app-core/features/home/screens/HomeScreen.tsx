import { useState } from 'react';
import { RefreshControl, Text } from 'react-native';

import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { PilgrimageRouteLocationInfoModal } from '../../../components/pilgrimage/RouteLocationInfoModal';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { PilgrimageConferenceCard } from '../../../components/pilgrimage/ConferenceCard';
import { PilgrimageQuartermasterSection } from '../../../components/pilgrimage/QuartermasterSection';
import { usePilgrimageRefresh } from '../../../hooks/usePilgrimageRefresh';
import {
  useEffectivePilgrimageDayNumber,
  usePilgrimageWindowState,
} from '../../../hooks/useSelectedPilgrimageDay';
import { useUserLocation } from '../../../hooks/useUserLocation';
import {
  PILGRIMAGE_YEAR,
  useGetPilgrimageDayQuery,
  useGetPilgrimageQuery,
} from '../../../services/pilgrimageApi';
import { formatDistanceKm } from '../../../utils/formatters/formatDistanceKm';
import { getRemainingDistanceFromCurrentLocation } from '../../../utils/pilgrimageCurrentLocation';
import { PilgrimageWeatherCard } from '../components/WeatherCard';
import { PilgrimageHomeHeroCard } from '../components/HomeHeroCard';
import { getPilgrimageRouteLabels } from '../../route/helpers/pilgrimageRouteLabels';
import { getRouteLocationMeta } from '../../route/helpers/pilgrimageRouteLocationMeta';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageHomeScreenProps = {
  onShowConference?: () => void;
  onShowQuartermaster?: () => void;
};

export function PilgrimageHomeScreen({
  onShowConference,
  onShowQuartermaster,
}: PilgrimageHomeScreenProps) {
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const windowState = usePilgrimageWindowState();
  const isActive = windowState === 'active';
  const { currentLocation, locationSource } = useUserLocation();
  const {
    data: pilgrimage,
    isLoading: isPilgrimageLoading,
    isFetching: isPilgrimageFetching,
  } = useGetPilgrimageQuery(PILGRIMAGE_YEAR, { skip: !isActive });
  const effectiveDayNumber = useEffectivePilgrimageDayNumber();
  const currentDayFetchNumber = pilgrimage?.totalDays
    ? Math.min(Math.max(effectiveDayNumber, 1), pilgrimage.totalDays)
    : null;
  const {
    data: pilgrimageDay,
    isLoading: isDayLoading,
    isFetching: isDayFetching,
    refetch: refetchCurrentDay,
  } = useGetPilgrimageDayQuery(
    {
      year: PILGRIMAGE_YEAR,
      dayNumber: currentDayFetchNumber ?? 1,
    },
    {
      skip: currentDayFetchNumber === null,
    }
  );
  const { isRefreshing: isManualRefreshing, refresh: handleRefresh } = usePilgrimageRefresh({
    includeNotifications: isActive,
    includeQuartermaster: isActive,
    additionalRefreshTasks:
      currentDayFetchNumber !== null ? [() => refetchCurrentDay()] : [],
  });
  const activeRouteData =
    pilgrimage && pilgrimageDay
      ? {
          pilgrimage,
          pilgrimageDay,
          source: 'remote' as const,
        }
      : null;
  const remainingDistanceKm = activeRouteData
    ? getRemainingDistanceFromCurrentLocation({
        day: activeRouteData.pilgrimageDay,
        currentLocation,
        locationSource,
      })
    : null;
  const routeLabels = activeRouteData
    ? getPilgrimageRouteLabels(activeRouteData.pilgrimageDay)
    : null;
  const routeLocationMeta = activeRouteData
    ? getRouteLocationMeta({
        day: activeRouteData.pilgrimageDay,
        currentLocation,
        locationSource,
      })
    : null;

  if (windowState === 'before') {
    return (
      <AppScreenScrollView
        className="flex-1"
        style={{ backgroundColor: AppColors.background }}
        contentContainerClassName="pt-8 pb-6"
        showsVerticalScrollIndicator={false}>
        <Text
          className="text-[22px] font-bold"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          Pielgrzymka jeszcze się nie rozpoczęła
        </Text>
        <Text
          className="mt-3 text-[16px] leading-7"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          Niedługo zaczynamy! Wróć 30 lipca.
        </Text>
      </AppScreenScrollView>
    );
  }

  if (windowState === 'after') {
    return (
      <AppScreenScrollView
        className="flex-1"
        style={{ backgroundColor: AppColors.background }}
        contentContainerClassName="pt-8 pb-6"
        showsVerticalScrollIndicator={false}>
        <Text
          className="text-[22px] font-bold"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          Pielgrzymka dobiegła końca
        </Text>
        <Text
          className="mt-3 text-[16px] leading-7"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          Dziękujemy za wspólną drogę. Do zobaczenia za rok!
        </Text>
      </AppScreenScrollView>
    );
  }

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
        {activeRouteData ? (
          <PilgrimageHomeHeroCard
            remainingDistanceLabel={formatDistanceKm(remainingDistanceKm ?? 0)}
            dayLabel={`Dzień ${activeRouteData.pilgrimageDay.dayNumber} z ${activeRouteData.pilgrimage.totalDays}`}
            routeLabel={`${routeLabels?.startLabel ?? 'Brak startu'} → ${routeLabels?.endLabel ?? 'Brak celu dnia'}`}
            onOpenInfo={() => {
              setIsInfoModalVisible(true);
            }}
          />
        ) : isPilgrimageLoading || isPilgrimageFetching || isDayLoading || isDayFetching ? (
          <AppLoader label="Pobieranie aktualnej trasy..." minHeight={320} />
        ) : (
          <Text
            className="mt-6 text-[16px] leading-7"
            style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
            Nie udało się pobrać aktualnej trasy z API.
          </Text>
        )}
        <PilgrimageQuartermasterSection onShowAll={onShowQuartermaster} />
        <PilgrimageConferenceCard
          title={activeRouteData?.pilgrimageDay.conference?.title}
          onPress={onShowConference}
        />
        <PilgrimageWeatherCard />
      </AppScreenScrollView>

      <PilgrimageRouteLocationInfoModal
        visible={isInfoModalVisible}
        modalDescription={routeLocationMeta?.modalDescription ?? ''}
        scheduleSourceLabel={routeLocationMeta?.scheduleSourceLabel}
        onClose={() => {
          setIsInfoModalVisible(false);
        }}
      />
    </>
  );
}

