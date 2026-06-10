import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { getApiBaseUrl } from './backendConfig';

export const backendBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
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

type FetchFromBackendOptions = {
  path: string;
  init?: RequestInit;
  errorContext?: string;
};

export async function fetchFromBackend<T>({
  path,
  init,
  errorContext = 'wykonywaniu żądania',
}: FetchFromBackendOptions): Promise<T> {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error('Brak skonfigurowanego adresu API backendu.');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, init);

  if (!response.ok) {
    throw new Error(`Backend zwrócił błąd ${response.status} przy ${errorContext}.`);
  }

  return (await response.json()) as T;
}
