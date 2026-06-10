import type {
  PilgrimageConference,
  PilgrimageDay,
  PilgrimageDayRoute,
  PilgrimageDayScheduleItem,
  RouteWaypoint,
  Town,
  UUID,
} from './pilgrimageRoute.types';

export function getTownById(townId: UUID, availableTowns: readonly Town[] = []) {
  return availableTowns.find((town) => town.id === townId);
}

export function getWaypointById(route: PilgrimageDayRoute, waypointId: UUID) {
  return route.waypoints.find((waypoint) => waypoint.id === waypointId);
}

export function getScheduleItemWaypoint(
  item: PilgrimageDayScheduleItem,
  day: PilgrimageDay
) {
  return getWaypointById(day.route, item.waypointId);
}

export function getScheduleItemTown(
  item: PilgrimageDayScheduleItem,
  day: PilgrimageDay
) {
  const waypoint = getScheduleItemWaypoint(item, day);
  return waypoint
    ? {
        id: waypoint.id,
        name: waypoint.townName ?? waypoint.name ?? '',
        subtitle:
          waypoint.name && waypoint.townName && waypoint.name !== waypoint.townName
            ? waypoint.name
            : undefined,
        latitude: waypoint.latitude ?? 0,
        longitude: waypoint.longitude ?? 0,
      }
    : undefined;
}

export function getRouteWaypointTown(waypoint: RouteWaypoint) {
  return {
    id: waypoint.id,
    name: waypoint.townName ?? waypoint.name ?? '',
    subtitle:
      waypoint.name && waypoint.townName && waypoint.name !== waypoint.townName
        ? waypoint.name
        : undefined,
    latitude: waypoint.latitude ?? 0,
    longitude: waypoint.longitude ?? 0,
  };
}

export function getDayStartTown(day: PilgrimageDay) {
  return getRouteWaypointTown(day.route.waypoints[0])!;
}

export function getDayEndTown(day: PilgrimageDay) {
  return getRouteWaypointTown(day.route.waypoints[day.route.waypoints.length - 1])!;
}

export function getPilgrimageConference(day: PilgrimageDay): PilgrimageConference {
  const sectionTitle = 'Konferencja dnia z trasy';
  const badgeLabel = 'Z trasy';
  const placeholderTitle = 'Konferencja zostanie dodana przed etapem';
  const placeholderSummary =
    'Tutaj pojawi sie temat, prowadzacy i krotki opis konferencji przygotowanej na dany dzien pielgrzymki.';

  return {
    sectionTitle,
    badgeLabel,
    id: day.conference?.id,
    date: day.conference?.date,
    author: day.conference?.author,
    title: day.conference?.title ?? placeholderTitle,
    summary: day.conference?.content ?? placeholderSummary,
    speaker: day.conference?.author,
    content: day.conference?.content,
  };
}

export function getRemainingDistanceKm(day: PilgrimageDay, currentTownId: UUID | undefined) {
  if (!currentTownId) {
    return day.route.totalDistanceKm;
  }

  const sortedWaypoints = [...day.route.waypoints].sort(
    (left, right) => left.orderIndex - right.orderIndex
  );
  const currentIndex = sortedWaypoints.findIndex((waypoint) => waypoint.id === currentTownId);

  if (currentIndex === -1) {
    return day.route.totalDistanceKm;
  }

  return sortedWaypoints
    .slice(currentIndex)
    .reduce((distance, waypoint) => distance + (waypoint.distanceToNextKm ?? 0), 0);
}
