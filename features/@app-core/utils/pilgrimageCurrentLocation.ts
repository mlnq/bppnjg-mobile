import type { LocationObjectCoords } from 'expo-location';

import {
  type GeoCoordinate,
  getRemainingDistanceKm,
  getTownById,
  getWaypointById,
  pilgrimageDay,
  type PilgrimageDay,
  type PilgrimageDayScheduleItem,
  towns as bundledTowns,
  type Town,
} from '../constants/pilgrimageRoute';

export type PilgrimageCurrentLocationResult = {
  location: Town;
  matchedScheduleItem: PilgrimageDayScheduleItem;
  source: 'time-estimated' | 'gps';
  fallbackReason?: 'outside-route' | 'location-unavailable';
  remainingDistanceKm?: number;
  traveledDistanceKm?: number;
};

const SCHEDULE_MATCH_RADIUS_KM = 2;
const GPS_ROUTE_MATCH_RADIUS_KM = 2;
const DISTANCE_ROUNDING_STEP_KM = 0.5;

const toRadians = (deg: number) => (deg * Math.PI) / 180;

const getDistanceKm = (start: GeoCoordinate, end: GeoCoordinate): number => {
  const earthRadiusKm = 6371;
  const dlatitude = toRadians(end.latitude - start.latitude);
  const dlongitude = toRadians(end.longitude - start.longitude);
  const a =
    Math.sin(dlatitude / 2) ** 2 +
    Math.cos(toRadians(start.latitude)) *
      Math.cos(toRadians(end.latitude)) *
      Math.sin(dlongitude / 2) ** 2;
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const projectPointToSegment = (point: GeoCoordinate, start: GeoCoordinate, end: GeoCoordinate) => {
  const meanlatitude = toRadians((start.latitude + end.latitude + point.latitude) / 3);
  const kmPerDeglatitude = 111.32;
  const kmPerDeglongitude = 111.32 * Math.cos(meanlatitude);

  const ax = start.longitude * kmPerDeglongitude,
    ay = start.latitude * kmPerDeglatitude;
  const bx = end.longitude * kmPerDeglongitude,
    by = end.latitude * kmPerDeglatitude;
  const px = point.longitude * kmPerDeglongitude,
    py = point.latitude * kmPerDeglatitude;

  const abx = bx - ax,
    aby = by - ay;
  const abLengthSq = abx * abx + aby * aby;

  if (abLengthSq === 0) return { ratio: 0, distanceKm: Math.hypot(px - ax, py - ay) };

  const ratio = Math.min(1, Math.max(0, ((px - ax) * abx + (py - ay) * aby) / abLengthSq));
  return { ratio, distanceKm: Math.hypot(px - (ax + abx * ratio), py - (ay + aby * ratio)) };
};

const roundDistanceKm = (distanceKm: number) =>
  Math.round(distanceKm / DISTANCE_ROUNDING_STEP_KM) * DISTANCE_ROUNDING_STEP_KM;

function getScheduleItemTown(
  item: PilgrimageDayScheduleItem,
  day: PilgrimageDay,
  availableTowns: readonly Town[]
) {
  const waypoint = getWaypointById(day.route, item.waypointId);
  return waypoint ? getTownById(waypoint.townId, availableTowns) : undefined;
}

function estimateGeoRouteProgress(day: PilgrimageDay, coords: GeoCoordinate) {
  const path = day.route.googleRoutePath;
  if (!path || path.length < 2) return null;

  let best = { traveledPathKm: 0, distanceToPathKm: Infinity };
  let cumulativeBeforeKm = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const segmentKm = getDistanceKm(path[i], path[i + 1]);
    const proj = projectPointToSegment(coords, path[i], path[i + 1]);

    if (proj.distanceKm < best.distanceToPathKm) {
      best = {
        traveledPathKm: cumulativeBeforeKm + segmentKm * proj.ratio,
        distanceToPathKm: proj.distanceKm,
      };
    }
    cumulativeBeforeKm += segmentKm;
  }

  const totalPathKm = day.route.totalDistanceKm;
  const traveled = Math.min(totalPathKm, best.traveledPathKm);
  return {
    distanceToPathKm: best.distanceToPathKm,
    traveledDistanceKm: traveled,
    remainingDistanceKm: roundDistanceKm(Math.max(0, totalPathKm - traveled)),
  };
}

function getScheduleItemByDistance(
  day: PilgrimageDay,
  traveledKm: number,
  availableTowns: readonly Town[],
  coords?: GeoCoordinate
) {
  let cumulativeKm = 0;
  const waypointDistances = new Map<string, number>();

  [...day.route.waypoints]
    .sort((left, right) => left.orderIndex - right.orderIndex)
    .forEach((waypoint) => {
      waypointDistances.set(waypoint.id, cumulativeKm);
      cumulativeKm += waypoint.distanceToNextKm ?? 0;
    });

  const scheduleWithDistances = day.schedule
    .map((item) => ({
      item,
      distance: waypointDistances.get(item.waypointId) ?? 0,
    }))
    .sort((left, right) => left.distance - right.distance);

  if (coords) {
    for (let i = scheduleWithDistances.length - 1; i >= 0; i--) {
      const candidateTown = getScheduleItemTown(scheduleWithDistances[i].item, day, availableTowns);
      if (!candidateTown) {
        continue;
      }
      const distanceToCandidateKm = getDistanceKm(coords, candidateTown);

      if (distanceToCandidateKm <= SCHEDULE_MATCH_RADIUS_KM) {
        return scheduleWithDistances[i].item;
      }
    }
  }

  for (let i = scheduleWithDistances.length - 1; i >= 0; i--) {
    if (scheduleWithDistances[i].distance <= traveledKm) {
      return scheduleWithDistances[i].item;
    }
  }

  return day.schedule[0];
}

function getScheduleItemByTime(day: PilgrimageDay, now: Date) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...day.schedule].sort((left, right) => {
    const leftMinutes = parseInt(left.time.split(':')[0]) * 60 + parseInt(left.time.split(':')[1]);
    const rightMinutes =
      parseInt(right.time.split(':')[0]) * 60 + parseInt(right.time.split(':')[1]);

    return leftMinutes - rightMinutes;
  });

  for (let i = sorted.length - 1; i >= 0; i--) {
    const itemMinutes =
      parseInt(sorted[i].time.split(':')[0]) * 60 + parseInt(sorted[i].time.split(':')[1]);

    if (itemMinutes <= currentMinutes) {
      return sorted[i];
    }
  }

  return sorted[0];
}

export function getCurrentRouteLocation(
  day: PilgrimageDay = pilgrimageDay,
  currentLocation: LocationObjectCoords | null = null,
  availableTowns: readonly Town[] = bundledTowns,
  now = new Date()
): PilgrimageCurrentLocationResult {
  if (currentLocation) {
    const progress = estimateGeoRouteProgress(day, {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    });

    if (progress && progress.distanceToPathKm <= GPS_ROUTE_MATCH_RADIUS_KM) {
      const item = getScheduleItemByDistance(day, progress.traveledDistanceKm, availableTowns, {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      return {
        location: getScheduleItemTown(item, day, availableTowns)!,
        matchedScheduleItem: item,
        source: 'gps',
        ...progress,
      };
    }

    return getCurrentScheduleLocation(day, now, availableTowns, 'outside-route');
  }

  return getCurrentScheduleLocation(day, now, availableTowns, 'location-unavailable');
}

export function getCurrentScheduleLocation(
  day: PilgrimageDay = pilgrimageDay,
  now = new Date(),
  availableTowns: readonly Town[] = bundledTowns,
  fallbackReason?: 'outside-route' | 'location-unavailable'
): PilgrimageCurrentLocationResult {
  const item = getScheduleItemByTime(day, now);
  return {
    location: getScheduleItemTown(item, day, availableTowns)!,
    matchedScheduleItem: item,
    source: 'time-estimated',
    fallbackReason,
  };
}

export function getRemainingDistanceFromCurrentLocation(
  params: {
    day?: PilgrimageDay;
    towns?: readonly Town[];
    currentLocation?: LocationObjectCoords | null;
    now?: Date;
  } = {}
) {
  const day = params.day ?? pilgrimageDay;
  const availableTowns = params.towns ?? bundledTowns;

  if (!params.currentLocation) {
    const scheduleLocation = getCurrentScheduleLocation(day, params.now ?? new Date(), availableTowns);

    return getRemainingDistanceKm(day, scheduleLocation.location.id);
  }

  const progress = estimateGeoRouteProgress(day, {
    latitude: params.currentLocation.latitude,
    longitude: params.currentLocation.longitude,
  });

  return progress?.remainingDistanceKm ?? getRemainingDistanceKm(day, day.route.startTownId);
}

export function getRouteStatusDescriptionFromCurrentLocation(
  params: {
    day?: PilgrimageDay;
    towns?: readonly Town[];
    currentLocation?: LocationObjectCoords | null;
    now?: Date;
  } = {}
) {
  const day = params.day ?? pilgrimageDay;
  const availableTowns = params.towns ?? bundledTowns;
  const currentRouteLocation = getCurrentRouteLocation(
    day,
    params.currentLocation ?? null,
    availableTowns,
    params.now ?? new Date()
  );
  const remainingDistanceKm =
    currentRouteLocation.remainingDistanceKm ??
    getRemainingDistanceKm(day, currentRouteLocation.location.id);
  const formattedDistanceKm = remainingDistanceKm.toFixed(1);

  if (currentRouteLocation.source === 'gps') {
    return `Jesteś na właściwej ścieżce. Do przejścia pozostało około ${formattedDistanceKm} km.`;
  }

  if (currentRouteLocation.fallbackReason === 'outside-route') {
    return `Jesteś poza zasięgiem trasy. Zgodnie z planem, do przejścia pozostało około ${formattedDistanceKm} km.`;
  }

  return `Twoja pozycja jest mierzona od ostatniego minionego postoju. Zgodnie z czasem, do przejścia pozostało około ${formattedDistanceKm} km.`;
}
