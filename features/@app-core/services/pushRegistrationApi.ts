import { getApiBaseUrl } from './backendConfig';

export async function registerExpoPushToken(params: {
  token: string;
  platform: string;
  projectId: string | null;
}) {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error('Brakuje EXPO_PUBLIC_API_BASE_URL w konfiguracji aplikacji.');
  }

  const response = await fetch(`${apiBaseUrl}/api/push/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: params.token,
      platform: params.platform,
      projectId: params.projectId ?? undefined,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;

    throw new Error(payload?.error?.message ?? `Push register failed with status ${response.status}`);
  }
}
