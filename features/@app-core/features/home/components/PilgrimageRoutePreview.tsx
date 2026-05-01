import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { pilgrimage, pilgrimageDay, towns } from '../../../constants/pilgrimageRoute';
import { getPilgrimageAssetSource } from '../../../constants/pilgrimageDayAssets';
import { useRouteFallbackMode } from '../../../hooks/useRouteFallbackMode';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { useGetPilgrimageBootstrapQuery } from '../../../services/pilgrimageApi';
import {
  formatRoutePreviewDistance,
  getRoutePreviewHasGpsSignal,
  getRoutePreviewLayout,
  getRoutePreviewLocationLabel,
  getRoutePreviewNextStopTitle,
  getRoutePreviewWalkedDistanceKm,
} from '../utils/pilgrimageRoutePreview.utils';
import {
  getCurrentRouteLocation,
  getRemainingDistanceFromCurrentLocation,
} from '../../../utils/pilgrimageCurrentLocation';

const { colors, radii, typography } = pilgrimageRouteTheme;

export function PilgrimageRoutePreview() {
  const { width } = useWindowDimensions();
  const {
    currentLocation: userLocation,
    hasPermission,
    isServicesEnabled,
  } = useUserLocation();
  const routeFallbackMode = useRouteFallbackMode();
  const { data, isLoading, isFetching } = useGetPilgrimageBootstrapQuery();
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
    return <AppLoader label="Pobieranie aktualnej trasy..." minHeight={220} />;
  }

  if (!activeData) {
    return null;
  }

  const currentLocation = getCurrentRouteLocation(
    activeData.pilgrimageDay,
    userLocation,
    activeData.towns
  );
  const remainingDistanceKm = getRemainingDistanceFromCurrentLocation({
    day: activeData.pilgrimageDay,
    towns: activeData.towns,
    currentLocation: userLocation,
  });
  const walkedDistanceKm = getRoutePreviewWalkedDistanceKm(
    activeData.pilgrimageDay.route.totalDistanceKm,
    remainingDistanceKm
  );
  const hasSignal = getRoutePreviewHasGpsSignal(isServicesEnabled, hasPermission, userLocation);
  const currentStopIndex = activeData.pilgrimageDay.schedule.findIndex(
    (item) => item.id === currentLocation.matchedScheduleItem.id
  );
  const nextStopTitle = getRoutePreviewNextStopTitle(
    activeData.pilgrimageDay.schedule,
    currentStopIndex,
    currentLocation.matchedScheduleItem.townName || currentLocation.location.name
  );
  const locationLabel = getRoutePreviewLocationLabel(
    currentLocation.matchedScheduleItem.name ||
      currentLocation.matchedScheduleItem.title ||
      currentLocation.location.name
  );
  const previewAssetSource = getPilgrimageAssetSource({
    stopAssetKey: currentLocation.matchedScheduleItem.assetKey,
  });
  const fallbackAssetSource = getPilgrimageAssetSource({});
  const {
    sectionHorizontalPadding,
    topInset,
    cityChipPaddingX,
    cityChipPaddingY,
    cityIconSize,
    cityFontSize,
    gpsChipSize,
    gpsIconSize,
    panelPadding,
    panelRadius,
    titleFontSize,
    titleLineHeight,
    distanceFontSize,
    distanceIconSize,
    chevronSize,
  } = getRoutePreviewLayout(width);

  return (
    <View className="mt-7" style={{ paddingHorizontal: sectionHorizontalPadding }}>
      <Text
        className="mb-1 text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
        {`Dzień ${activeData.pilgrimageDay.dayNumber}.`}
      </Text>
      <Text
        className="mb-[14px] text-[20px] font-bold"
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        Aktualna lokalizacja
      </Text>
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: radii.lg,
          aspectRatio: 4 / 5,
          overflow: 'hidden',
          elevation: 5,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}>
        <Image
          source={previewAssetSource}
          placeholder={fallbackAssetSource}
          placeholderContentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
          contentFit="cover"
          style={[StyleSheet.absoluteFillObject, { borderRadius: radii.lg }]}
        />
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}
        />

        <View className="relative z-10 flex-1" style={{ padding: topInset }}>
          <View className="flex-row items-start justify-between gap-4">
            <View
              className="flex-row items-center gap-2 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                elevation: 2,
                paddingHorizontal: cityChipPaddingX,
                paddingVertical: cityChipPaddingY,
              }}>
              <MaterialCommunityIcons name="map-marker" size={cityIconSize} color="#111111" />
              <Text
                className="font-semibold"
                style={{
                  color: '#111111',
                  fontFamily: typography.fontFamily,
                  fontSize: cityFontSize,
                }}>
                {locationLabel}
              </Text>
            </View>

            <View
              className="items-center justify-center rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                elevation: 2,
                height: gpsChipSize,
                width: gpsChipSize,
              }}>
              <MaterialCommunityIcons
                name={hasSignal ? 'crosshairs-gps' : 'crosshairs-off'}
                size={gpsIconSize}
                color={hasSignal ? '#2e7d32' : '#d32f2f'}
              />
            </View>
          </View>

          <View className="flex-1" />

          <View
            className="bg-white/95 shadow-lg"
            style={{
              backgroundColor: 'rgba(248,249,250,0.95)',
              elevation: 8,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              marginBottom: 4,
              borderRadius: panelRadius,
              padding: panelPadding,
            }}>
            <Text
              className="font-bold"
              numberOfLines={2}
              style={{
                color: '#111111',
                fontFamily: typography.fontFamily,
                fontSize: titleFontSize,
                lineHeight: titleLineHeight,
              }}>
              {nextStopTitle}
            </Text>

            <View className="mt-2 flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <MaterialCommunityIcons name="walk" size={distanceIconSize} color="#666666" />
                <Text
                  className="font-medium"
                  style={{
                    color: '#666666',
                    fontFamily: typography.fontFamily,
                    fontSize: distanceFontSize,
                  }}>
                  Przebyto: {formatRoutePreviewDistance(walkedDistanceKm)}
                </Text>
              </View>

              <MaterialCommunityIcons name="chevron-right" size={chevronSize} color="#cccccc" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
