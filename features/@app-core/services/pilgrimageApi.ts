import {
  createApi,
} from '@reduxjs/toolkit/query/react';

import type { Pilgrimage, PilgrimageDay } from '../constants/pilgrimageRoute';
import { getPilgrimageStopAssetKey } from '../constants/pilgrimageDayAssets';
import { backendBaseQuery } from './backendApi';

export const PILGRIMAGE_YEAR = '2025';

export type CurrentRouteStateDto = {
  source: 'gps' | 'time-estimated';
  currentTownId: string;
  matchedScheduleItemId: string | null;
  traveledDistanceKm: number;
  remainingDistanceKm: number;
  statusLabel: string;
  description: string;
  computedAt: string;
};

export type RouteStateRequest = {
  pilgrimageId: string;
  dayId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

type ApiStop = {
  id: string;
  orderIndex: number;
  name: string | null;
  townName: string | null;
  time: string;
  type: 'info' | 'night' | 'start';
  distanceToNextKm: number;
  durationMin?: number | null;
  latitude: number | null;
  longitude: number | null;
  description?: string | null;
  badge?: string | null;
};

type ApiPilgrimageDay = {
  id: string;
  dayNumber: number;
  title: string;
  date: string;
  route: {
    startStopId: string;
    endStopId: string;
    totalDistanceKm: number;
    scheduledStartTime: string;
    plannedArrivalTime: string;
  };
  stops: ApiStop[];
  reflection?: {
    title: string;
  };
  conference?: {
    id: number;
    date: string;
    author: string;
    title: string;
    content: string;
  };
  weather?: {
    temperatureC: number;
    icon: 'sunny' | 'cloudy' | 'rain' | 'storm' | 'partlyCloudy';
  };
  news: PilgrimageDay['news'];
};

type ApiPilgrimage = {
  id: string;
  name: string;
  startDate: string;
  totalDays: number;
  totalDistanceKm: number;
  overall: {
    traveledDistanceKm: number;
    remainingDistanceKm: number;
    totalDistanceKm: number;
    progressPercent: number;
    completedDayCount: number;
    activeDayNumber: number;
  };
  days: ApiPilgrimageDay[];
};

type ApiPilgrimageBootstrapResponse = {
  pilgrimage: ApiPilgrimage | null;
};

export type PilgrimageBootstrap = {
  pilgrimage: Pilgrimage;
  pilgrimageDay: PilgrimageDay;
  source: 'remote';
};

const PILGRIMAGE_START_MONTH_INDEX = 6;
const PILGRIMAGE_START_DAY = 30;
const PILGRIMAGE_END_MONTH_INDEX = 7;
const PILGRIMAGE_END_DAY = 12;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function normalizeDate(value: Date) {
  const normalized = new Date(value);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

function getPilgrimageDayNumberFromDate(date = new Date()) {
  const year = date.getFullYear();
  const currentDate = normalizeDate(date);
  const startDate = normalizeDate(new Date(year, PILGRIMAGE_START_MONTH_INDEX, PILGRIMAGE_START_DAY));
  const endDate = normalizeDate(new Date(year, PILGRIMAGE_END_MONTH_INDEX, PILGRIMAGE_END_DAY));

  if (currentDate < startDate) {
    return 1;
  }

  if (currentDate > endDate) {
    return 14;
  }

  return Math.floor((currentDate.getTime() - startDate.getTime()) / DAY_IN_MS) + 1;
}

function buildWeatherSummary(icon: NonNullable<ApiPilgrimageDay['weather']>['icon']) {
  if (icon === 'sunny') {
    return 'Słonecznie';
  }

  if (icon === 'partlyCloudy') {
    return 'Częściowe zachmurzenie';
  }

  if (icon === 'cloudy') {
    return 'Pochmurno';
  }

  if (icon === 'storm') {
    return 'Burze w okolicy';
  }

  return 'Deszcz na trasie';
}

function getRoutePath(stops: ApiStop[]) {
  return stops.flatMap((stop) =>
    stop.latitude !== null && stop.longitude !== null
      ? [{ latitude: stop.latitude, longitude: stop.longitude }]
      : []
  );
}

function transformPilgrimageDay(day: ApiPilgrimageDay): PilgrimageDay {
  const waypoints = day.stops.map((stop) => {
    return {
      id: stop.id,
      orderIndex: stop.orderIndex,
      latitude: stop.latitude,
      longitude: stop.longitude,
      name: stop.name,
      townName: stop.townName,
      assetKey: getPilgrimageStopAssetKey(day.dayNumber, stop.orderIndex),
      distanceToNextKm: stop.distanceToNextKm || undefined,
    };
  });

  const schedule = day.stops.map((stop) => {
    const normalizedName = stop.name ?? '';
    const normalizedTownName = stop.townName ?? '';

    return {
      id: stop.id,
      type: stop.type,
      time: stop.time,
      waypointId: stop.id,
      assetKey: getPilgrimageStopAssetKey(day.dayNumber, stop.orderIndex),
      name: stop.name,
      townName: stop.townName,
      distanceToNextKm: stop.distanceToNextKm ?? 0,
      durationMin: stop.durationMin ?? 0,
      latitude: stop.latitude,
      longitude: stop.longitude,
      title:
        normalizedName && normalizedTownName && normalizedName !== normalizedTownName
          ? normalizedName
          : undefined,
      description: stop.description ?? undefined,
      badge: stop.badge ?? undefined,
    };
  });

  return {
    id: day.id,
    dayNumber: day.dayNumber,
    title: day.title,
    date: day.date,
    route: {
      id: `${day.id}_route`,
      startStopId: day.route.startStopId,
      endStopId: day.route.endStopId,
      waypoints,
      googleRoutePath: getRoutePath(day.stops),
      totalDistanceKm: day.route.totalDistanceKm,
      scheduledStartTime: day.route.scheduledStartTime,
      plannedArrivalTime: day.route.plannedArrivalTime,
    },
    schedule,
    reflection: {
      title: day.reflection?.title ?? 'SŁOWO NA DZIŚ',
      quote: day.conference?.title ?? '',
      reference: '',
    },
    conference: day.conference,
    weather: day.weather
      ? {
          temperatureC: day.weather.temperatureC,
          summary: buildWeatherSummary(day.weather.icon),
          icon: day.weather.icon,
        }
      : {
          temperatureC: 20,
          summary: 'Prognoza chwilowo niedostępna.',
          icon: 'partlyCloudy',
        },
    news: day.news ?? [],
  };
}

function transformPilgrimage(apiPilgrimage: ApiPilgrimage): Pilgrimage {
  const days = apiPilgrimage.days.map((day) => transformPilgrimageDay(day));

  return {
    id: apiPilgrimage.id,
    name: apiPilgrimage.name,
    startDate: apiPilgrimage.startDate,
    totalDays: apiPilgrimage.totalDays,
    totalDistanceKm: apiPilgrimage.totalDistanceKm,
    overall: apiPilgrimage.overall,
    days,
  };
}

function selectBootstrapDay(pilgrimage: Pilgrimage) {
  const currentDayNumber = getPilgrimageDayNumberFromDate();

  return (
    pilgrimage.days.find((day) => day.dayNumber === currentDayNumber) ??
    pilgrimage.days[0] ??
    null
  );
}

export const pilgrimageApi = createApi({
  reducerPath: 'pilgrimageApi',
  baseQuery: backendBaseQuery,
  tagTypes: ['PilgrimageData'],
  keepUnusedDataFor: 60 * 60 * 24,
  endpoints: (builder) => ({
    getPilgrimage: builder.query<Pilgrimage, string>({
      query: (year) => `/api/pilgrimages/${year}`,
      transformResponse: (response: ApiPilgrimage) => transformPilgrimage(response),
      providesTags: ['PilgrimageData'],
    }),
    getPilgrimageDay: builder.query<PilgrimageDay, { year: string; dayNumber: number }>({
      query: ({ year, dayNumber }) => `/api/pilgrimages/${year}/days/${dayNumber}`,
      transformResponse: (response: ApiPilgrimageDay) => transformPilgrimageDay(response),
      providesTags: ['PilgrimageData'],
    }),
    postRouteState: builder.mutation<CurrentRouteStateDto, RouteStateRequest>({
      query: (body) => ({
        url: `/api/pilgrimages/${PILGRIMAGE_YEAR}/days/${body.dayId}/route-state`,
        method: 'POST',
        body,
      }),
    }),
    getRouteStateFallback: builder.query<CurrentRouteStateDto, { year: string; dayNumber: number }>({
      query: ({ year, dayNumber }) => `/api/pilgrimages/${year}/days/${dayNumber}/route-state`,
      providesTags: ['PilgrimageData'],
    }),
    getPilgrimageBootstrap: builder.query<PilgrimageBootstrap, void>({
      query: () => `/api/pilgrimages/${PILGRIMAGE_YEAR}/bootstrap`,
      transformResponse: (response: ApiPilgrimageBootstrapResponse) => {
        if (!response.pilgrimage) {
          throw new Error('Backend zwrócił niepełne dane trasy.');
        }

        const pilgrimage = transformPilgrimage(response.pilgrimage);
        const pilgrimageDay = selectBootstrapDay(pilgrimage);

        if (!pilgrimageDay) {
          throw new Error('Backend nie zwrócił żadnego dnia pielgrzymki.');
        }

        return {
          pilgrimage,
          pilgrimageDay,
          source: 'remote' as const,
        };
      },
      providesTags: ['PilgrimageData'],
    }),
  }),
});

export const {
  useGetPilgrimageQuery,
  useGetPilgrimageDayQuery,
  usePostRouteStateMutation,
  useGetRouteStateFallbackQuery,
  useGetPilgrimageBootstrapQuery,
} = pilgrimageApi;
