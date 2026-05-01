import * as FileSystem from 'expo-file-system/legacy';
import * as Notifications from 'expo-notifications';

import type {
  PilgrimageNewsCategory,
  PilgrimageNewsItem,
  PilgrimagePushType,
} from '../constants/pilgrimageRoute';
import { resolvePushNotificationRoute } from './pushNotificationNavigation';

const LOCAL_NOTIFICATION_NEWS_FILE = `${FileSystem.documentDirectory ?? ''}notification-news.json`;
const MAX_LOCAL_NOTIFICATION_NEWS_ITEMS = 50;
const NEWS_CATEGORIES: readonly PilgrimageNewsCategory[] = [
  'announcement',
  'logistics',
  'spiritual',
  'weather',
];
const PUSH_TYPES: readonly PilgrimagePushType[] = [
  'announcement',
  'logistics',
  'spiritual',
  'weather',
  'medical',
  'general',
  'quartermaster',
  'test',
];

function toNewsCategory(value: unknown): PilgrimageNewsCategory {
  if (typeof value !== 'string') {
    return 'announcement';
  }

  if (value === 'medical' || value === 'quartermaster') {
    return 'logistics';
  }

  if (value === 'general' || value === 'test') {
    return 'announcement';
  }

  return NEWS_CATEGORIES.includes(value as PilgrimageNewsCategory)
    ? (value as PilgrimageNewsCategory)
    : 'announcement';
}

function toPushType(value: unknown): PilgrimagePushType | undefined {
  return typeof value === 'string' && PUSH_TYPES.includes(value as PilgrimagePushType)
    ? (value as PilgrimagePushType)
    : undefined;
}

function toBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value === 'true';
  }

  return false;
}

function sortNewsItems(items: PilgrimageNewsItem[]) {
  return [...items].sort((left, right) => {
    if (Boolean(left.isPinned) !== Boolean(right.isPinned)) {
      return left.isPinned ? -1 : 1;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
}

function normalizeStoredNewsItem(item: Partial<PilgrimageNewsItem>): PilgrimageNewsItem | null {
  if (
    typeof item.id !== 'string' ||
    typeof item.title !== 'string' ||
    typeof item.summary !== 'string' ||
    typeof item.publishedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    publishedAt: item.publishedAt,
    category: toNewsCategory(item.category),
    isPinned: typeof item.isPinned === 'boolean' ? item.isPinned : undefined,
    targetRoute: typeof item.targetRoute === 'string' ? item.targetRoute : undefined,
    pushType: toPushType(item.pushType),
  };
}

async function writeStoredNotificationNewsItems(items: PilgrimageNewsItem[]) {
  await FileSystem.writeAsStringAsync(
    LOCAL_NOTIFICATION_NEWS_FILE,
    JSON.stringify(sortNewsItems(items).slice(0, MAX_LOCAL_NOTIFICATION_NEWS_ITEMS))
  );
}

export async function readStoredNotificationNewsItems(): Promise<PilgrimageNewsItem[]> {
  if (!FileSystem.documentDirectory) {
    return [];
  }

  const fileInfo = await FileSystem.getInfoAsync(LOCAL_NOTIFICATION_NEWS_FILE);

  if (!fileInfo.exists) {
    return [];
  }

  try {
    const content = await FileSystem.readAsStringAsync(LOCAL_NOTIFICATION_NEWS_FILE);
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => normalizeStoredNewsItem(item as Partial<PilgrimageNewsItem>))
      .filter((item): item is PilgrimageNewsItem => item !== null);
  } catch {
    return [];
  }
}

export async function clearStoredNotificationNewsItems() {
  if (!FileSystem.documentDirectory) {
    return;
  }

  const fileInfo = await FileSystem.getInfoAsync(LOCAL_NOTIFICATION_NEWS_FILE);

  if (!fileInfo.exists) {
    return;
  }

  await FileSystem.deleteAsync(LOCAL_NOTIFICATION_NEWS_FILE, { idempotent: true });
}

export function mergeNotificationNewsItems(
  primaryItems: readonly PilgrimageNewsItem[],
  secondaryItems: readonly PilgrimageNewsItem[]
) {
  const itemsById = new Map<string, PilgrimageNewsItem>();

  for (const item of [...primaryItems, ...secondaryItems]) {
    if (!itemsById.has(item.id)) {
      itemsById.set(item.id, item);
    }
  }

  return sortNewsItems([...itemsById.values()]);
}

export function mapPushNotificationToNewsItem(
  notification: Notifications.Notification
): PilgrimageNewsItem {
  const content = notification.request.content;
  const data = content.data ?? {};
  const title =
    typeof content.title === 'string' && content.title.trim().length > 0
      ? content.title.trim()
      : 'Nowa wiadomość';
  const summary =
    typeof content.body === 'string' && content.body.trim().length > 0
      ? content.body.trim()
      : 'Otrzymano nowe powiadomienie.';
  const publishedAt =
    typeof data.publishedAt === 'string' && !Number.isNaN(Date.parse(data.publishedAt))
      ? data.publishedAt
      : toPublishedAt(notification.date);

  return {
    id:
      typeof data.newsId === 'string' && data.newsId.trim().length > 0
        ? data.newsId
        : `push:${notification.request.identifier}`,
    title,
    summary,
    publishedAt,
    category: toNewsCategory(data.category),
    isPinned: toBoolean(data.isPinned) || undefined,
    targetRoute: resolvePushNotificationRoute(data),
    pushType: toPushType(data.type ?? data.category),
  };
}

export async function storePushNotificationAsNewsItem(notification: Notifications.Notification) {
  const nextItem = mapPushNotificationToNewsItem(notification);
  const storedItems = await readStoredNotificationNewsItems();
  const mergedItems = mergeNotificationNewsItems([nextItem], storedItems);

  await writeStoredNotificationNewsItems(mergedItems);

  return nextItem;
}
function toPublishedAt(value: Date | number) {
  return typeof value === 'number' ? new Date(value).toISOString() : value.toISOString();
}
