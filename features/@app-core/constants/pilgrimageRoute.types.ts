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
  orderIndex: number;
  latitude: number | null;
  longitude: number | null;
  name: string | null;
  townName: string | null;
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
  name: string | null;
  townName: string | null;
  distanceToNextKm: number;
  durationMin: number;
  latitude: number | null;
  longitude: number | null;
  title?: string;
  description?: string;
  badge?: string;
  note?: string;
};

export type RoutePathPoint = Pick<Town, 'latitude' | 'longitude'>;

export type PilgrimageDayRoute = {
  id: UUID;
  startStopId: UUID;
  endStopId: UUID;
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
  conference?: {
    id: number;
    date: string;
    author: string;
    title: string;
    content: string;
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
  id?: number;
  date?: string;
  author?: string;
  sectionTitle: string;
  badgeLabel: string;
  title: string;
  summary: string;
  speaker?: string;
  durationMin?: number;
  content?: string;
};

export type Pilgrimage = {
  id: UUID;
  name: string;
  startDate: string;
  totalDays: number;
  totalDistanceKm?: number;
  overall?: {
    traveledDistanceKm: number;
    remainingDistanceKm: number;
    totalDistanceKm: number;
    progressPercent: number;
    completedDayCount: number;
    activeDayNumber: number;
  };
  days: readonly PilgrimageDay[];
};

export type RawManifestDay = {
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

export type RawManifest = {
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

export type RawWaypoint = {
  orderIndex: number;
  latitude: number;
  longitude: number;
  name: string | null;
  townName: string | null;
  note?: string;
  distanceToNextKm: number;
};

export type RawDay = {
  dayNumber: number;
  title: string;
  date: string;
  totalDistanceKm: number;
  startTown: string | null;
  endTown: string | null;
  waypointCount: number;
  waypoints: RawWaypoint[];
};
