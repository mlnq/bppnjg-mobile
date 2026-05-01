import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import type { Pilgrimage, PilgrimageDay, PilgrimageNewsItem, Town } from '../constants/pilgrimageRoute';
import { getPilgrimageStopAssetKey } from '../constants/pilgrimageDayAssets';
import { getApiBaseUrl } from './backendConfig';

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

type MobileBootstrapResponse = {
  pilgrimage: Pilgrimage | null;
  pilgrimageDay: PilgrimageDay | null;
  towns: Town[];
  news: PilgrimageNewsItem[];
};

export type PilgrimageBootstrap = {
  pilgrimage: Pilgrimage;
  pilgrimageDay: PilgrimageDay;
  towns: Town[];
  news: PilgrimageNewsItem[];
  source: 'remote';
};

const enrichPilgrimageDayAssets = (pilgrimageDay: PilgrimageDay): PilgrimageDay => {
  const waypoints =
    pilgrimageDay.route.waypoints?.map((waypoint) => ({
      ...waypoint,
      assetKey: waypoint.assetKey ?? getPilgrimageStopAssetKey(pilgrimageDay.dayNumber, waypoint.orderIndex),
    })) ?? [];

  const assetKeyByWaypointId = new Map(waypoints.map((waypoint) => [waypoint.id, waypoint.assetKey]));

  return {
    ...pilgrimageDay,
    route: {
      ...pilgrimageDay.route,
      waypoints,
    },
    schedule:
      pilgrimageDay.schedule?.map((item) => ({
        ...item,
        assetKey: item.assetKey ?? assetKeyByWaypointId.get(item.waypointId),
        name: item.name ?? item.title ?? '',
        townName: item.townName ?? '',
        distanceToNextKm: item.distanceToNextKm ?? 0,
        durationMin: item.durationMin ?? 0,
      })) ?? [],
  };
};

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: 'Brak skonfigurowanego adresu API backendu.',
      },
    };
  }

  const rawBaseQuery = fetchBaseQuery({ baseUrl: apiBaseUrl });
  return rawBaseQuery(args, api, extraOptions);
};

export const pilgrimageApi = createApi({
  reducerPath: 'pilgrimageApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['PilgrimageData'],
  keepUnusedDataFor: 60 * 60 * 24,
  endpoints: (builder) => ({
    getPilgrimage: builder.query<Pilgrimage, string>({
      query: (year) => `/api/pilgrimages/${year}`,
      providesTags: ['PilgrimageData'],
    }),
    getPilgrimageDay: builder.query<PilgrimageDay, { year: string; dayNumber: number }>({
      query: ({ year, dayNumber }) => `/api/pilgrimages/${year}/days/${dayNumber}`,
      transformResponse: (response: PilgrimageDay) => enrichPilgrimageDayAssets(response),
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
      transformResponse: (response: MobileBootstrapResponse) => {
        if (!response.pilgrimage || !response.pilgrimageDay) {
          throw new Error('Backend zwrócił niepełne dane trasy.');
        }

        return {
          pilgrimage: response.pilgrimage,
          pilgrimageDay: enrichPilgrimageDayAssets(response.pilgrimageDay),
          towns: response.towns ?? [],
          news: response.news ?? [],
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
