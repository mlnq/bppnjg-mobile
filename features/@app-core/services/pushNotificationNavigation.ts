import { getPrayerBookEntryById } from '../features/prayer/helpers/pilgrimagePrayerBook.helpers';

function readNotificationDataValue(data: unknown, key: string) {
  if (!data || typeof data !== 'object') {
    return undefined;
  }

  const value = (data as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : undefined;
}

export function resolvePushNotificationRoute(data: unknown) {
  const screen = readNotificationDataValue(data, 'screen')?.toLowerCase();

  if (!screen) {
    return '/news' as const;
  }

  if (screen === 'home' || screen === 'main') {
    return '/' as const;
  }

  if (screen === 'news' || screen === 'wieści' || screen === 'wiesci') {
    return '/news' as const;
  }

  if (screen === 'quartermaster') {
    const commentId = readNotificationDataValue(data, 'quartermasterCommentId');

    if (commentId) {
      return `/quartermaster/${commentId}` as const;
    }

    return '/quartermaster' as const;
  }

  if (screen === 'route' || screen === 'map') {
    return '/route' as const;
  }

  if (screen === 'conference' || screen === 'konferencja') {
    return '/conference' as const;
  }

  if (screen === 'prayer') {
    return '/prayer' as const;
  }

  if (screen === 'breviary' || screen === 'prayer-breviary') {
    return '/prayer/breviary' as const;
  }

  if (screen === 'readings' || screen === 'prayer-readings') {
    return '/prayer/readings' as const;
  }

  if (screen === 'prayer-book') {
    const entryId =
      readNotificationDataValue(data, 'prayerBookEntryId') ??
      readNotificationDataValue(data, 'entryId');

    if (entryId && getPrayerBookEntryById(entryId as Parameters<typeof getPrayerBookEntryById>[0])) {
      return `/prayer/book/${entryId}` as const;
    }

    return '/prayer/book' as const;
  }

  return '/news' as const;
}
