import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { showToastOnce } from './appToast';
import { fetchFromBackend } from './backendApi';

export type QuartermasterComment = {
  id: string;
  code?: string;
  dayId?: string;
  dayCode?: string;
  dayNumber?: number;
  title: string;
  content: string;
  publishedAt: string;
};

type QuartermasterResponse = {
  items?: QuartermasterComment[];
};

async function fetchQuartermasterComments(): Promise<QuartermasterComment[]> {
  const payload = await fetchFromBackend<QuartermasterResponse>({
    path: '/api/quartermaster-comments',
    errorContext: 'pobieraniu komentarza kwatermistrza',
  });
  return payload.items ?? [];
}

export const quartermasterApi = createApi({
  reducerPath: 'quartermasterApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['QuartermasterComments'],
  endpoints: (builder) => ({
    getQuartermasterComments: builder.query<QuartermasterComment[], void>({
      async queryFn() {
        try {
          const items = await fetchQuartermasterComments();
          return { data: items };
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Nie udało się pobrać wieści kwatermistrzowskich.';
          showToastOnce(message);
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              error: message,
            },
          };
        }
      },
      providesTags: ['QuartermasterComments'],
    }),
  }),
});

export const { useGetQuartermasterCommentsQuery } = quartermasterApi;
