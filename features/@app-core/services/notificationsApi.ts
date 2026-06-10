import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { PilgrimageNewsItem } from '../constants/pilgrimageRoute';
import { showToastOnce } from './appToast';
import { fetchFromBackend } from './backendApi';
import {
  mergeNotificationNewsItems,
  readStoredNotificationNewsItems,
} from './localNotificationNews';
import {
  mapNotificationNewsCategory,
  mapNotificationPushType,
} from './notificationNewsMapping';

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

async function fetchRemoteNews(): Promise<PilgrimageNewsItem[]> {
  const payload = await fetchFromBackend<BackendNewsResponse>({
    path: '/api/news?limit=50&page=1',
    errorContext: 'pobieraniu newsów',
  });

  return (payload.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary || item.content || '',
    publishedAt: item.publishedAt,
    category: mapNotificationNewsCategory(item.category),
    isPinned: item.isPinned || undefined,
    pushType: mapNotificationPushType(item.category),
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
