import type { LocationObjectCoords } from 'expo-location';

import {
  type GeoCoordinate,
  type PilgrimageDay,
  type PilgrimageDayScheduleItem,
  getRemainingDistanceKm,
  getWaypointById,
} from '../constants/pilgrimageRoute';
import type { LocationSource } from '../store/preferencesSlice';

// Types

type PilgrimageRouteLocationPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type PilgrimageCurrentLocationResult = {
  location: PilgrimageRouteLocationPoint;
  matchedScheduleItem: PilgrimageDayScheduleItem;
  source: 'time-estimated' | 'gps';
  fallbackReason?: 'outside-route' | 'location-unavailable';
  remainingDistanceKm?: number;
  traveledDistanceKm?: number;
};

type RouteParams = {
  day: PilgrimageDay;
  currentLocation?: LocationObjectCoords | null;
  now?: Date;
  locationSource?: LocationSource;
};

// Constants

const SCHEDULE_MATCH_RADIUS_KM = 2;
const GPS_ROUTE_MATCH_RADIUS_KM = 2;
const DISTANCE_ROUNDING_STEP_KM = 0.5;
const DEFAULT_WALKING_SPEED_KMH = 4.5;
const MIN_WALKING_SPEED_KMH = 3;
const MAX_WALKING_SPEED_KMH = 7;

// Geo helpers

const toRadians = (deg: number) => (deg * Math.PI) / 180;

function getDistanceKm(a: GeoCoordinate, b: GeoCoordinate): number {
  const R = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function projectPointToSegment(point: GeoCoordinate, start: GeoCoordinate, end: GeoCoordinate) {
  const midLat = toRadians((start.latitude + end.latitude + point.latitude) / 3);
  const kLat = 111.32;
  const kLng = 111.32 * Math.cos(midLat);

  const [ax, ay] = [start.longitude * kLng, start.latitude * kLat];
  const [dx, dy] = [
    (end.longitude - start.longitude) * kLng,
    (end.latitude - start.latitude) * kLat,
  ];
  const [px, py] = [point.longitude * kLng, point.latitude * kLat];

  const lenSq = dx * dx + dy * dy;
  const ratio =
    lenSq === 0 ? 0 : Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / lenSq));

  return {
    ratio,
    distanceKm: Math.hypot(px - (ax + dx * ratio), py - (ay + dy * ratio)),
  };
}

const roundDistance = (km: number) =>
  Math.round(km / DISTANCE_ROUNDING_STEP_KM) * DISTANCE_ROUNDING_STEP_KM;

const parseTimeMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const toCoords = (loc: LocationObjectCoords): GeoCoordinate => ({
  latitude: loc.latitude,
  longitude: loc.longitude,
});

// Route progress

type RouteProgress = {
  distanceToPathKm: number;
  traveledDistanceKm: number;
  remainingDistanceKm: number;
};

function estimateRouteProgress(day: PilgrimageDay, coords: GeoCoordinate): RouteProgress | null {
  const path = day.route.googleRoutePath;
  if (!path || path.length < 2) return null;

  let bestTraveled = 0;
  let bestDistToPath = Infinity;
  let cumulativeKm = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const segKm = getDistanceKm(path[i], path[i + 1]);
    const { ratio, distanceKm } = projectPointToSegment(coords, path[i], path[i + 1]);

    if (distanceKm < bestDistToPath) {
      bestDistToPath = distanceKm;
      bestTraveled = cumulativeKm + segKm * ratio;
    }
    cumulativeKm += segKm;
  }

  const traveled = Math.min(day.route.totalDistanceKm, bestTraveled);

  return {
    distanceToPathKm: bestDistToPath,
    traveledDistanceKm: traveled,
    remainingDistanceKm: roundDistance(Math.max(0, day.route.totalDistanceKm - traveled)),
  };
}

// GPS progress — null if outside route or unavailable

function getGpsProgress(
  day: PilgrimageDay,
  currentLocation: LocationObjectCoords | null
): RouteProgress | null {
  if (!currentLocation) return null;
  const progress = estimateRouteProgress(day, toCoords(currentLocation));
  return progress && progress.distanceToPathKm <= GPS_ROUTE_MATCH_RADIUS_KM ? progress : null;
}

// Schedule helpers

function getScheduleItemLocation(
  item: PilgrimageDayScheduleItem,
  day: PilgrimageDay
): PilgrimageRouteLocationPoint | undefined {
  const waypoint = getWaypointById(day.route, item.waypointId);
  const latitude = item.latitude ?? waypoint?.latitude ?? null;
  const longitude = item.longitude ?? waypoint?.longitude ?? null;

  if (latitude === null || longitude === null) return undefined;

  return {
    id: item.id,
    name: item.townName ?? item.name ?? 'Nieznany punkt',
    latitude,
    longitude,
  };
}

function buildWaypointDistanceMap(day: PilgrimageDay): Map<string, number> {
  const map = new Map<string, number>();
  let cumulative = 0;
  [...day.route.waypoints]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((wp) => {
      map.set(wp.id, cumulative);
      cumulative += wp.distanceToNextKm ?? 0;
    });
  return map;
}

function getScheduleItemByDistance(
  day: PilgrimageDay,
  traveledKm: number,
  coords?: GeoCoordinate
): PilgrimageDayScheduleItem {
  const waypointDistances = buildWaypointDistanceMap(day);
  const sorted = [...day.schedule]
    .map((item) => ({ item, distanceKm: waypointDistances.get(item.waypointId) ?? 0 }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (coords) {
    for (let i = sorted.length - 1; i >= 0; i--) {
      const location = getScheduleItemLocation(sorted[i].item, day);
      if (location && getDistanceKm(coords, location) <= SCHEDULE_MATCH_RADIUS_KM) {
        return sorted[i].item;
      }
    }
  }

  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].distanceKm <= traveledKm) return sorted[i].item;
  }

  return day.schedule[0];
}

function getScheduleItemByTime(day: PilgrimageDay, now: Date): PilgrimageDayScheduleItem {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...day.schedule].sort(
    (a, b) => parseTimeMinutes(a.time) - parseTimeMinutes(b.time)
  );
  return sorted.findLast((s) => parseTimeMinutes(s.time) <= nowMinutes) ?? sorted[0];
}

function buildResult(
  item: PilgrimageDayScheduleItem,
  day: PilgrimageDay,
  source: PilgrimageCurrentLocationResult['source'],
  fallbackReason?: PilgrimageCurrentLocationResult['fallbackReason'],
  progress?: RouteProgress
): PilgrimageCurrentLocationResult {
  const location = getScheduleItemLocation(item, day);
  const firstWaypoint = day.route.waypoints[0];

  return {
    location: location ?? {
      id: item.id,
      name: item.townName ?? item.name ?? 'Nieznany punkt',
      latitude: firstWaypoint?.latitude ?? 0,
      longitude: firstWaypoint?.longitude ?? 0,
    },
    matchedScheduleItem: item,
    source,
    fallbackReason,
    traveledDistanceKm: progress?.traveledDistanceKm,
    remainingDistanceKm: progress?.remainingDistanceKm,
  };
}

// Public API

export function getCurrentRouteLocation(
  day: PilgrimageDay,
  currentLocation: LocationObjectCoords | null = null,
  now = new Date(),
  locationSource: LocationSource = 'auto'
): PilgrimageCurrentLocationResult {
  if (locationSource === 'time-only') {
    return getScheduleBasedLocation(day, now);
  }

  const progress =
    locationSource === 'gps-only' || locationSource === 'auto'
      ? getGpsProgress(day, currentLocation)
      : null;

  if (progress) {
    const coords = toCoords(currentLocation!);
    const item = getScheduleItemByDistance(day, progress.traveledDistanceKm, coords);
    return buildResult(item, day, 'gps', undefined, progress);
  }

  if (locationSource === 'gps-only') {
    return getScheduleBasedLocation(day, now, 'location-unavailable');
  }

  const fallbackReason = currentLocation ? 'outside-route' : 'location-unavailable';
  return getScheduleBasedLocation(day, now, fallbackReason);
}

export function getScheduleBasedLocation(
  day: PilgrimageDay,
  now = new Date(),
  fallbackReason?: 'outside-route' | 'location-unavailable'
): PilgrimageCurrentLocationResult {
  const item = getScheduleItemByTime(day, now);
  return buildResult(item, day, 'time-estimated', fallbackReason);
}

export function getRemainingDistanceFromCurrentLocation(params: RouteParams): number {
  const { day } = params;
  const locationSource = params.locationSource ?? 'auto';

  if (locationSource === 'time-only') {
    const location = getScheduleBasedLocation(day, params.now ?? new Date());
    return getRemainingDistanceKm(day, location.location.id);
  }

  const progress = getGpsProgress(day, params.currentLocation ?? null);

  if (progress) return progress.remainingDistanceKm;

  const location = getScheduleBasedLocation(day, params.now ?? new Date());
  return getRemainingDistanceKm(day, location.location.id);
}

// Duration estimate

function getEffectiveWalkingSpeedKmh(day: PilgrimageDay): number {
  if (day.schedule.length < 2) return DEFAULT_WALKING_SPEED_KMH;

  const sorted = [...day.schedule].sort(
    (a, b) => parseTimeMinutes(a.time) - parseTimeMinutes(b.time)
  );
  const totalBreakMin = sorted
    .slice(1)
    .reduce((sum, item) => sum + Math.max(0, item.durationMin ?? 0), 0);
  const windowMin = parseTimeMinutes(sorted.at(-1)!.time) - parseTimeMinutes(sorted[0].time);
  const movingMin = windowMin - totalBreakMin;

  if (movingMin > 0) {
    const speed = (day.route.totalDistanceKm / movingMin) * 60;
    if (speed >= MIN_WALKING_SPEED_KMH && speed <= MAX_WALKING_SPEED_KMH) return speed;
  }

  return DEFAULT_WALKING_SPEED_KMH;
}

export function getEstimatedRemainingDurationMinutes(
  params: RouteParams
): number {
  const { day } = params;
  const now = params.now ?? new Date();
  const currentLocation = params.currentLocation ?? null;
  const locationSource = params.locationSource ?? 'auto';

  const result = getCurrentRouteLocation(day, currentLocation, now, locationSource);
  // Prefer GPS remaining distance from result; fall back to schedule-based
  const remainingKm = result.remainingDistanceKm ?? getRemainingDistanceKm(day, result.location.id);

  const currentIdx = day.schedule.findIndex((s) => s.id === result.matchedScheduleItem.id);
  const remainingBreakMin = day.schedule
    .slice(currentIdx + 1)
    .reduce((sum, item) => sum + Math.max(0, item.durationMin ?? 0), 0);

  return Math.max(
    0,
    Math.round((remainingKm / getEffectiveWalkingSpeedKmh(day)) * 60 + remainingBreakMin)
  );
}

// Status description

export function getRouteStatusDescriptionFromCurrentLocation(
  params: RouteParams
): string {
  const { day } = params;
  const now = params.now ?? new Date();
  const locationSource = params.locationSource ?? 'auto';

  const result = getCurrentRouteLocation(day, params.currentLocation ?? null, now, locationSource);
  const remainingKm =
    result.remainingDistanceKm ??
    getRemainingDistanceFromCurrentLocation({
      day,
      currentLocation: params.currentLocation,
      now,
      locationSource,
    });
  const formatted = remainingKm.toFixed(1);

  if (result.source === 'gps') {
    return `Jesteś na właściwej ścieżce. Do przejścia pozostało około ${formatted} km.`;
  }
  if (result.fallbackReason === 'outside-route') {
    return `Jesteś poza zasięgiem trasy. Zgodnie z planem, do przejścia pozostało około ${formatted} km.`;
  }
  return `Twoja pozycja jest mierzona od ostatniego minionego postoju. Zgodnie z czasem, do przejścia pozostało około ${formatted} km.`;
}
