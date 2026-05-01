import type { PilgrimageDayScheduleItem } from '../../../constants/pilgrimageRoute';

export const formatRoutePreviewDistance = (value: number | undefined) =>
  typeof value === 'number' ? `${value.toFixed(1)} km` : 'brak danych';

export const getRoutePreviewWalkedDistanceKm = (
  totalDistanceKm: number,
  remainingDistanceKm: number
) => Math.max(0, totalDistanceKm - remainingDistanceKm);

export const getRoutePreviewHasGpsSignal = (
  isServicesEnabled: boolean,
  hasPermission: boolean,
  currentLocation: unknown
) => isServicesEnabled && hasPermission && Boolean(currentLocation);

export const getRoutePreviewNextStopTitle = (
  stops: readonly PilgrimageDayScheduleItem[],
  currentStopIndex: number,
  townName: string
) => {
  if (stops.length > 0 && currentStopIndex === stops.length - 1) {
    return `Nocleg: ${townName}`;
  }

  return townName;
};

export const getRoutePreviewLocationLabel = (stopName: string, maxLength = 28) => {
  if (stopName.length <= maxLength) {
    return stopName;
  }

  return `${stopName.slice(0, maxLength - 1)}…`;
};

export const getRoutePreviewLayout = (width: number) => {
  const isCompact = width < 380;

  return {
    sectionHorizontalPadding: isCompact ? 12 : 16,
    topInset: isCompact ? 12 : 16,
    cityChipPaddingX: isCompact ? 10 : 12,
    cityChipPaddingY: isCompact ? 6 : 8,
    cityIconSize: isCompact ? 13 : 14,
    cityFontSize: isCompact ? 12 : 13,
    gpsChipSize: isCompact ? 36 : 40,
    gpsIconSize: isCompact ? 16 : 18,
    panelPadding: isCompact ? 14 : 20,
    panelRadius: isCompact ? 20 : 24,
    titleFontSize: isCompact ? 17 : 20,
    titleLineHeight: isCompact ? 22 : 26,
    distanceFontSize: isCompact ? 13 : 14,
    distanceIconSize: isCompact ? 14 : 16,
    chevronSize: isCompact ? 18 : 20,
  };
};
