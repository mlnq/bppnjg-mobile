import type { LocationObjectCoords } from 'expo-location';

import type { PilgrimageDay } from '../../../constants/pilgrimageRoute';
import type { LocationSource } from '../../../store/preferencesSlice';
import { getCurrentRouteLocation } from '../../../utils/pilgrimageCurrentLocation';
import { getScheduleSourceLabel } from './pilgrimageRouteStatus.helpers';

type GetRouteLocationMetaParams = {
  day: PilgrimageDay;
  currentLocation: LocationObjectCoords | null;
  locationSource?: LocationSource;
  now?: Date;
};

export function getRouteLocationMeta({
  day,
  currentLocation,
  locationSource = 'auto',
  now,
}: GetRouteLocationMetaParams) {
  const currentRouteLocation = getCurrentRouteLocation(day, currentLocation, now, locationSource);
  const scheduleSourceLabel =
    locationSource === 'time-only'
      ? 'trybu godzinowego'
      : getScheduleSourceLabel(currentRouteLocation.source);
  const isScheduleEstimated = currentRouteLocation.source === 'time-estimated';
  const modalDescription =
    locationSource === 'time-only'
      ? 'Masz w aplikacji włączony tryb godzinowy, więc pozycję i kilometry liczymy wyłącznie z planu dnia.'
      : currentRouteLocation.source === 'gps'
      ? 'Telefon pokazuje Twoją pozycję na trasie, więc dystans i aktualny punkt wyznaczamy na podstawie GPS.'
      : currentRouteLocation.fallbackReason === 'outside-route'
        ? 'Jesteś teraz poza trasą, więc pokazujemy pozycję i kilometry zgodnie z planem dnia.'
        : 'Telefon nie pokazuje teraz pozycji na trasie, więc pokazujemy pozycję i kilometry zgodnie z planem dnia.';

  return {
    currentRouteLocation,
    scheduleSourceLabel,
    isScheduleEstimated,
    isForcedTimeMode: locationSource === 'time-only',
    modalDescription,
  };
}
