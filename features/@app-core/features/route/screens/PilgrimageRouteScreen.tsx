import { Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { pilgrimage, pilgrimageDay, towns } from '../../../constants/pilgrimageRoute';
import { useRouteFallbackMode } from '../../../hooks/useRouteFallbackMode';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { useGetPilgrimageBootstrapQuery } from '../../../services/pilgrimageApi';
import {
  getCurrentRouteLocation,
} from '../../../utils/pilgrimageCurrentLocation';
import { PilgrimageDaySchedule } from '../components/PilgrimageDaySchedule';
import { PilgrimageRouteHeroCard } from '../components/PilgrimageRouteHeroCard';
import { getScheduleSourceLabel } from '../helpers/pilgrimageRouteStatus.helpers';

const { colors, typography } = pilgrimageRouteTheme;

export function PilgrimageRouteScreen() {
  const { currentLocation } = useUserLocation();
  const routeFallbackMode = useRouteFallbackMode();
  const { data, isLoading, isFetching, isError, refetch } = useGetPilgrimageBootstrapQuery();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsManualRefreshing(true);

    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };
  const fallbackData =
    routeFallbackMode.isEnabled && routeFallbackMode.isHydrated
      ? {
          pilgrimage,
          pilgrimageDay,
          towns,
          news: [...pilgrimageDay.news],
          source: 'bundled-fallback' as const,
        }
      : null;
  const activeData = data ?? fallbackData;

  if (!activeData && (isLoading || isFetching)) {
    return (
      <View className="flex-1 px-4" style={{ backgroundColor: colors.surface }}>
        <AppLoader label="Pobieranie danych etapu z backendu..." minHeight={320} />
      </View>
    );
  }

  if (!activeData) {
    return (
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.surface }}
        contentContainerClassName="px-4 pt-8 pb-6"
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
          style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
          Nie udało się pobrać harmonogramu dnia z backendu.
        </Text>
      </ScrollView>
    );
  }

  const currentRouteLocation = getCurrentRouteLocation(
    activeData.pilgrimageDay,
    currentLocation,
    activeData.towns
  );
  const scheduleSourceLabel = getScheduleSourceLabel(currentRouteLocation.source);
  const isScheduleEstimated = currentRouteLocation.source === 'time-estimated';
  const accentColor = isScheduleEstimated ? colors.secondary : colors.primary;
  const modalDescription =
    currentRouteLocation.source === 'gps'
      ? 'Telefon pokazuje Twoją pozycję na trasie, więc dystans i aktualny punkt wyznaczamy na podstawie GPS.'
      : currentRouteLocation.fallbackReason === 'outside-route'
        ? 'Jesteś teraz poza trasą, więc pokazujemy pozycję i kilometry zgodnie z planem dnia.'
        : 'Telefon nie pokazuje teraz pozycji na trasie, więc pokazujemy pozycję i kilometry zgodnie z planem dnia.';

  return (
    <>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.surface }}
        contentContainerClassName="px-4 pt-2 pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor={accentColor}
          />
        }>
        <PilgrimageRouteHeroCard
          day={activeData.pilgrimageDay}
          towns={activeData.towns}
          totalDays={activeData.pilgrimage.totalDays}
          accentSource={currentRouteLocation.source}
          positionLabel={currentRouteLocation.source === 'gps' ? 'GPS' : 'plan'}
          onOpenInfo={() => {
            setIsInfoModalVisible(true);
          }}
        />
        {isError ? (
          <Text
            className="mt-4 text-[12px] font-medium uppercase tracking-[0.8px]"
            style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
            Wyświetlane są ostatnio zapisane dane.
          </Text>
        ) : null}
        <PilgrimageDaySchedule day={activeData.pilgrimageDay} towns={activeData.towns} />
      </ScrollView>

      <Modal
        visible={isInfoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsInfoModalVisible(false);
        }}>
        <View
          className="flex-1 justify-end px-4 pb-6 pt-12"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View
            className="rounded-[24px] px-5 py-5"
            style={{ backgroundColor: colors.surfaceContainerLowest }}>
            <Text
              className="text-[16px] font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              Jak wyznaczamy pozycję na trasie
            </Text>
            <Text
              className="mt-3 text-[15px] leading-7"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {modalDescription}
            </Text>
            <Text
              className="mt-3 text-[12px] font-medium uppercase tracking-[0.8px]"
              style={{ color: accentColor, fontFamily: typography.fontFamily }}>
              Aktualnie: {scheduleSourceLabel}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsInfoModalVisible(false);
              }}
              className="mt-5 self-end rounded-full px-4 py-2"
              style={{ backgroundColor: isScheduleEstimated ? '#fff4d6' : '#f9edf4' }}>
              <Text
                className="text-[12px] font-bold uppercase tracking-[0.8px]"
                style={{ color: accentColor, fontFamily: typography.fontFamily }}>
                Zamknij
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
