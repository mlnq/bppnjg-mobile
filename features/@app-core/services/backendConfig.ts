import Constants from 'expo-constants';

export function getApiBaseUrl() {
  const value =
    Constants.expoConfig?.extra?.apiBaseUrl ??
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    null;

  return typeof value === 'string' ? value.replace(/\/$/, '') : null;
}
