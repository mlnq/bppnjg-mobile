import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_LAST_SEEN_AT_KEY = 'notifications_last_seen_at';

export async function readNotificationsLastSeenAt() {
  const storedValue = await AsyncStorage.getItem(NOTIFICATIONS_LAST_SEEN_AT_KEY);

  if (!storedValue || Number.isNaN(Date.parse(storedValue))) {
    return null;
  }

  return storedValue;
}

export async function writeNotificationsLastSeenAt(publishedAt: string) {
  if (Number.isNaN(Date.parse(publishedAt))) {
    return;
  }

  await AsyncStorage.setItem(NOTIFICATIONS_LAST_SEEN_AT_KEY, publishedAt);
}
