import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { PilgrimageNewsItem, PilgrimagePushType } from '../constants/pilgrimageRoute';
import { showToastOnce } from './appToast';
import { getApiBaseUrl } from './backendConfig';
import {
  mergeNotificationNewsItems,
  readStoredNotificationNewsItems,
} from './localNotificationNews';

type BackendNewsItem = {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  publishedAt: string;
  isPinned?: boolean;
};

type BackendNewsResponse = {
  items?: BackendNewsItem[];
};

function mapNewsCategory(category: string): PilgrimageNewsItem['category'] {
  if (category === 'logistics' || category === 'quartermaster' || category === 'medical') {
    return 'logistics';
  }

  if (category === 'spiritual') {
    return 'spiritual';
  }

  return 'announcement';
}

function mapPushType(category: string): PilgrimagePushType | undefined {
  if (
    category === 'announcement' ||
    category === 'logistics' ||
    category === 'spiritual' ||
    category === 'weather' ||
    category === 'medical' ||
    category === 'general' ||
    category === 'quartermaster' ||
    category === 'test'
  ) {
    return category;
  }

  return undefined;
}

async function fetchRemoteNews(): Promise<PilgrimageNewsItem[]> {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error('Brak skonfigurowanego adresu API backendu.');
  }

  const response = await fetch(`${apiBaseUrl}/api/news?limit=50&page=1`);

  if (!response.ok) {
    throw new Error(`Backend zwrócił błąd ${response.status} przy pobieraniu newsów.`);
  }

  const payload = (await response.json()) as BackendNewsResponse;

  return (payload.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary || item.content || '',
    publishedAt: item.publishedAt,
    category: mapNewsCategory(item.category),
    isPinned: item.isPinned || undefined,
    pushType: mapPushType(item.category),
  }));
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['PilgrimageNotifications'],
  endpoints: (builder) => ({
    getPilgrimageNotifications: builder.query<PilgrimageNewsItem[], void>({
      async queryFn() {
        try {
          const remoteResult = await fetchRemoteNews()
            .then((items) => ({ items, failed: false }))
            .catch((error) => {
              const message =
                error instanceof Error
                  ? error.message
                  : 'Nie udało się pobrać wieści z backendu.';
              showToastOnce(`${message} Pokazuję lokalną historię powiadomień.`);
              return { items: [] as PilgrimageNewsItem[], failed: true };
            });

          const localItems = await readStoredNotificationNewsItems().catch((error) => {
            const message =
              error instanceof Error
                ? error.message
                : 'Nie udało się odczytać lokalnej historii powiadomień.';
            showToastOnce(message);
            return [] as PilgrimageNewsItem[];
          });

          if (remoteResult.items.length === 0 && localItems.length === 0) {
            return { data: [] };
          }

          return {
            data: mergeNotificationNewsItems(remoteResult.items, localItems),
          };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Nie udało się wczytać wieści z backendu.';
          showToastOnce(message);
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              error: message,
            },
          };
        }
      },
      providesTags: ['PilgrimageNotifications'],
    }),
  }),
});

export const { useGetPilgrimageNotificationsQuery } = notificationsApi;
