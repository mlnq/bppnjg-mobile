import day01 from '../../../data/pilgrimage_routes/day_01.json';
import day02 from '../../../data/pilgrimage_routes/day_02.json';
import day03 from '../../../data/pilgrimage_routes/day_03.json';
import day04 from '../../../data/pilgrimage_routes/day_04.json';
import day05 from '../../../data/pilgrimage_routes/day_05.json';
import day06 from '../../../data/pilgrimage_routes/day_06.json';
import day07 from '../../../data/pilgrimage_routes/day_07.json';
import day08 from '../../../data/pilgrimage_routes/day_08.json';
import day09 from '../../../data/pilgrimage_routes/day_09.json';
import day10 from '../../../data/pilgrimage_routes/day_10.json';
import day11 from '../../../data/pilgrimage_routes/day_11.json';
import day12 from '../../../data/pilgrimage_routes/day_12.json';
import day13 from '../../../data/pilgrimage_routes/day_13.json';
import day14 from '../../../data/pilgrimage_routes/day_14.json';
import manifest from '../../../data/pilgrimage_routes/manifest.json';
import { getPilgrimageStopAssetKey } from './pilgrimageDayAssets';

export type UUID = string;

export type PilgrimageWaypointKind =
  | 'start'
  | 'rest'
  | 'meal'
  | 'info'
  | 'mass'
  | 'night'
  | 'medical'
  | 'prayer';

export type PilgrimageWeatherIcon = 'sunny' | 'cloudy' | 'rain' | 'storm' | 'partlyCloudy';

export type PilgrimageNewsCategory = 'announcement' | 'logistics' | 'spiritual' | 'weather';
export type PilgrimagePushType =
  | 'announcement'
  | 'logistics'
  | 'spiritual'
  | 'weather'
  | 'medical'
  | 'general'
  | 'quartermaster'
  | 'test';

export type GeoCoordinate = {
  latitude: number;
  longitude: number;
};

export type Town = {
  id: UUID;
  name: string;
  subtitle?: string;
} & GeoCoordinate;

export type RouteWaypoint = {
  id: UUID;
  townId: UUID;
  orderIndex: number;
  assetKey?: string;
  distanceToNextKm?: number;
  note?: string;
};

export type PilgrimageDayScheduleItem = {
  id: UUID;
  type: PilgrimageWaypointKind;
  time: string;
  waypointId: UUID;
  assetKey?: string;
  name: string;
  townName: string;
  distanceToNextKm: number;
  durationMin: number;
  title?: string;
  description: string;
  badge?: string;
  note?: string;
};

export type RoutePathPoint = Pick<Town, 'latitude' | 'longitude'>;

export type PilgrimageDayRoute = {
  id: UUID;
  startTownId: UUID;
  endTownId: UUID;
  waypoints: readonly RouteWaypoint[];
  googleRoutePath?: readonly RoutePathPoint[];
  totalDistanceKm: number;
  scheduledStartTime: string;
  plannedArrivalTime: string;
};

export type PilgrimageDay = {
  id: UUID;
  dayNumber: number;
  title: string;
  date: string;
  route: PilgrimageDayRoute;
  schedule: readonly PilgrimageDayScheduleItem[];
  reflection: {
    title: string;
    quote: string;
    reference: string;
  };
  weather: {
    temperatureC: number;
    summary: string;
    icon: PilgrimageWeatherIcon;
  };
  news: readonly {
    id: UUID;
    title: string;
    summary: string;
    publishedAt: string;
    category: PilgrimageNewsCategory;
    isPinned?: boolean;
    targetRoute?: string;
    pushType?: PilgrimagePushType;
  }[];
};

export type PilgrimageWeather = PilgrimageDay['weather'];
export type PilgrimageReflection = PilgrimageDay['reflection'];
export type PilgrimageNewsItem = PilgrimageDay['news'][number];
export type PilgrimageConference = {
  sectionTitle: string;
  badgeLabel: string;
  title: string;
  summary: string;
  speaker?: string;
  durationMin?: number;
};

export type Pilgrimage = {
  id: UUID;
  name: string;
  startDate: string;
  destinationTownId: UUID;
  totalDays: number;
  days: readonly PilgrimageDay[];
};

type RawManifestDay = {
  dayNumber: number;
  title: string;
  date: string;
  totalDistanceKm: number;
  waypointCount: number;
  startTown: string | null;
  endTown: string | null;
  file: string;
  conference?: {
    title?: string;
    summary?: string;
    speaker?: string;
    durationMin?: number;
  };
};

type RawManifest = {
  pilgrimageName: string;
  year: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalDistanceKm: number;
  conferenceDefaults?: {
    sectionTitle?: string;
    placeholderTitle?: string;
    placeholderSummary?: string;
    badgeLabel?: string;
  };
  days: RawManifestDay[];
};

type RawWaypoint = {
  orderIndex: number;
  latitude: number;
  longitude: number;
  name: string | null;
  townName: string | null;
  note?: string;
  distanceToNextKm: number;
};

type RawDay = {
  dayNumber: number;
  title: string;
  date: string;
  totalDistanceKm: number;
  startTown: string | null;
  endTown: string | null;
  waypointCount: number;
  waypoints: RawWaypoint[];
};

const rawManifest = manifest as RawManifest;
const rawDays = [
  day01,
  day02,
  day03,
  day04,
  day05,
  day06,
  day07,
  day08,
  day09,
  day10,
  day11,
  day12,
  day13,
  day14,
] as RawDay[];

const DAY_START_TIME = '06:00';
const DAY_END_TIME = '18:30';
const WEATHER_ICONS: readonly PilgrimageWeatherIcon[] = [
  'partlyCloudy',
  'sunny',
  'cloudy',
  'rain',
];
const REFLECTIONS = [
  {
    title: 'SLOWO NA DZISIAJ',
    quote: 'Prowadz mnie droga prawdy i nadziei.',
    reference: 'Ps 25, 5',
  },
  {
    title: 'MYSL DNIA',
    quote: 'Pan umacnia kroki czlowieka, gdy jego droga Mu sie podoba.',
    reference: 'Ps 37, 23',
  },
  {
    title: 'ROZWAZANIE',
    quote: 'W wytrwalosci biegniemy w zawodach, patrzac na Jezusa.',
    reference: 'Hbr 12, 1-2',
  },
] as const satisfies readonly PilgrimageReflection[];

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toRoutePointId(value: number) {
  return value.toFixed(6).replace('.', '_');
}

function toTownLabel(dayNumber: number, waypoint: RawWaypoint) {
  return waypoint.townName ?? waypoint.name ?? `Punkt dnia ${dayNumber}.${waypoint.orderIndex + 1}`;
}

function toTownKey(dayNumber: number, waypoint: RawWaypoint) {
  return `${toTownLabel(dayNumber, waypoint)}:${toRoutePointId(waypoint.latitude)}:${toRoutePointId(
    waypoint.longitude
  )}`;
}

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = Math.round(totalMinutes % 60)
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}`;
}

function parseTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function getScheduleKind(index: number, total: number): PilgrimageWaypointKind {
  if (index === 0) {
    return 'start';
  }

  if (index === total - 1) {
    return 'night';
  }

  if (index === Math.floor(total / 2)) {
    return 'meal';
  }

  return 'rest';
}

function getScheduleBadge(type: PilgrimageWaypointKind) {
  if (type === 'start') {
    return 'START';
  }

  if (type === 'night') {
    return 'NOCLEG';
  }

  return undefined;
}

function getScheduleDescription(type: PilgrimageWaypointKind, townName: string) {
  if (type === 'start') {
    return `Rozpoczecie etapu w ${townName}.`;
  }

  if (type === 'night') {
    return `Zakonczenie etapu i wejscie do miejsca noclegowego w ${townName}.`;
  }

  if (type === 'meal') {
    return `Dluzszy postoj regeneracyjny w okolicy ${townName}.`;
  }

  return `Postoj organizacyjny na trasie w okolicy ${townName}.`;
}

function buildRouteSchedule(day: RawDay, route: PilgrimageDayRoute): readonly PilgrimageDayScheduleItem[] {
  const startMinutes = parseTime(DAY_START_TIME);
  const endMinutes = parseTime(DAY_END_TIME);
  const totalWindow = endMinutes - startMinutes;
  const totalDistance = Math.max(route.totalDistanceKm, 1);
  let cumulativeDistance = 0;

  return route.waypoints.map((waypoint, index) => {
    const town = getTownById(waypoint.townId);
    const type = getScheduleKind(index, route.waypoints.length);
    const progress = index === 0 ? 0 : cumulativeDistance / totalDistance;
    const time = formatMinutes(startMinutes + totalWindow * progress);

    cumulativeDistance += waypoint.distanceToNextKm ?? 0;

    return {
      id: `day-${day.dayNumber}-schedule-${index + 1}`,
      type,
      time,
      waypointId: waypoint.id,
      assetKey: waypoint.assetKey,
      name: town?.subtitle ?? town?.name ?? `Punkt ${index + 1}`,
      townName: town?.name ?? `Punkt ${index + 1}`,
      distanceToNextKm: waypoint.distanceToNextKm ?? 0,
      durationMin: 0,
      title: town?.subtitle,
      description: getScheduleDescription(type, town?.name ?? `punkcie ${index + 1}`),
      badge: getScheduleBadge(type),
      note: waypoint.note,
    };
  });
}

function buildReflection(dayNumber: number): PilgrimageReflection {
  return REFLECTIONS[(dayNumber - 1) % REFLECTIONS.length];
}

function buildWeather(dayNumber: number): PilgrimageWeather {
  return {
    temperatureC: 19 + (dayNumber % 8),
    summary: 'Prognoza niedostepna w danych trasy',
    icon: WEATHER_ICONS[(dayNumber - 1) % WEATHER_ICONS.length],
  };
}

function buildNews(day: RawDay): readonly PilgrimageNewsItem[] {
  return [
    {
      id: `day-${day.dayNumber}-news-route`,
      title: `Etap ${day.dayNumber}: ${day.title}`,
      summary: `Trasa dnia ma ${day.totalDistanceKm.toFixed(1)} km i ${day.waypointCount} waypointow.`,
      publishedAt: `${day.date}T05:30:00+02:00`,
      category: 'announcement',
      isPinned: true,
    },
  ];
}

const townEntries = new Map<string, Town>();

for (const rawDay of rawDays) {
  for (const waypoint of rawDay.waypoints) {
    const key = toTownKey(rawDay.dayNumber, waypoint);

    if (!townEntries.has(key)) {
      const name = toTownLabel(rawDay.dayNumber, waypoint);
      townEntries.set(key, {
        id: `town-${slugify(name)}-${toRoutePointId(waypoint.latitude)}-${toRoutePointId(waypoint.longitude)}`,
        name,
        subtitle: waypoint.name ?? undefined,
        latitude: waypoint.latitude,
        longitude: waypoint.longitude,
      });
    }
  }
}

export const towns = [...townEntries.values()];

function buildRoute(rawDay: RawDay): PilgrimageDayRoute {
  const waypoints: RouteWaypoint[] = rawDay.waypoints.map((waypoint) => {
    const townId = townEntries.get(toTownKey(rawDay.dayNumber, waypoint))!.id;
    return {
      id: `day-${rawDay.dayNumber}-waypoint-${waypoint.orderIndex + 1}`,
      townId,
      orderIndex: waypoint.orderIndex,
      assetKey: getPilgrimageStopAssetKey(rawDay.dayNumber, waypoint.orderIndex),
      distanceToNextKm: waypoint.distanceToNextKm || undefined,
      note: waypoint.note,
    };
  });

  return {
    id: `day-${rawDay.dayNumber}-route`,
    startTownId: waypoints[0].townId,
    endTownId: waypoints[waypoints.length - 1].townId,
    waypoints,
    googleRoutePath: rawDay.waypoints.map((waypoint) => ({
      latitude: waypoint.latitude,
      longitude: waypoint.longitude,
    })),
    totalDistanceKm: rawDay.totalDistanceKm,
    scheduledStartTime: DAY_START_TIME,
    plannedArrivalTime: DAY_END_TIME,
  };
}

const pilgrimageDays = rawDays.map((rawDay) => {
  const route = buildRoute(rawDay);

  return {
    id: `day-${rawDay.dayNumber}`,
    dayNumber: rawDay.dayNumber,
    title: rawDay.title,
    date: rawDay.date,
    route,
    schedule: buildRouteSchedule(rawDay, route),
    reflection: buildReflection(rawDay.dayNumber),
    weather: buildWeather(rawDay.dayNumber),
    news: buildNews(rawDay),
  };
}) satisfies readonly PilgrimageDay[];

export const pilgrimage: Pilgrimage = {
  id: `pilgrimage-${rawManifest.year}`,
  name: rawManifest.pilgrimageName,
  startDate: rawManifest.startDate,
  destinationTownId: pilgrimageDays[pilgrimageDays.length - 1].route.endTownId,
  totalDays: rawManifest.totalDays,
  days: pilgrimageDays,
};

export const pilgrimageDay = pilgrimage.days[0];

export function getTownById(townId: UUID, availableTowns: readonly Town[] = towns) {
  return availableTowns.find((town) => town.id === townId);
}

export function getWaypointById(route: PilgrimageDayRoute, waypointId: UUID) {
  return route.waypoints.find((waypoint) => waypoint.id === waypointId);
}

export function getScheduleItemWaypoint(
  item: PilgrimageDayScheduleItem,
  day: PilgrimageDay = pilgrimageDay
) {
  return getWaypointById(day.route, item.waypointId);
}

export function getScheduleItemTown(
  item: PilgrimageDayScheduleItem,
  day: PilgrimageDay = pilgrimageDay
) {
  const waypoint = getScheduleItemWaypoint(item, day);
  return waypoint ? getTownById(waypoint.townId) : undefined;
}

export function getRouteWaypointTown(waypoint: RouteWaypoint) {
  return getTownById(waypoint.townId);
}

export function getDayStartTown(day: PilgrimageDay = pilgrimageDay) {
  return getTownById(day.route.startTownId)!;
}

export function getDayEndTown(day: PilgrimageDay = pilgrimageDay) {
  return getTownById(day.route.endTownId)!;
}

export function getPilgrimageDestination(targetPilgrimage: Pilgrimage = pilgrimage) {
  return getTownById(targetPilgrimage.destinationTownId)!;
}

export function getPilgrimageConference(day: PilgrimageDay = pilgrimageDay): PilgrimageConference {
  const manifestDay = rawManifest.days.find((item) => item.dayNumber === day.dayNumber);
  const defaults = rawManifest.conferenceDefaults;
  const sectionTitle = defaults?.sectionTitle ?? 'Konferencja dnia z trasy';
  const badgeLabel = defaults?.badgeLabel ?? 'Z trasy';
  const placeholderTitle = defaults?.placeholderTitle ?? 'Konferencja zostanie dodana przed etapem';
  const placeholderSummary =
    defaults?.placeholderSummary ??
    'Tutaj pojawi się temat, prowadzący i krótki opis konferencji przygotowanej na dany dzień pielgrzymki.';

  return {
    sectionTitle,
    badgeLabel,
    title: manifestDay?.conference?.title ?? placeholderTitle,
    summary: manifestDay?.conference?.summary ?? placeholderSummary,
    speaker: manifestDay?.conference?.speaker,
    durationMin: manifestDay?.conference?.durationMin,
  };
}

export function getRemainingDistanceKm(day: PilgrimageDay, currentTownId: UUID | undefined) {
  if (!currentTownId) {
    return day.route.totalDistanceKm;
  }

  const sortedWaypoints = [...day.route.waypoints].sort(
    (left, right) => left.orderIndex - right.orderIndex
  );
  const currentIndex = sortedWaypoints.findIndex((waypoint) => waypoint.townId === currentTownId);

  if (currentIndex === -1) {
    return day.route.totalDistanceKm;
  }

  return sortedWaypoints
    .slice(currentIndex)
    .reduce((distance, waypoint) => distance + (waypoint.distanceToNextKm ?? 0), 0);
}
