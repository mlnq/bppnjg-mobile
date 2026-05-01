import { useEffect, useState } from 'react';

import type { PilgrimageNewsItem } from '../constants/pilgrimageRoute';
import { readNotificationsLastSeenAt } from '../services/notificationSeen';

function getLatestNotificationPublishedAt(items: readonly PilgrimageNewsItem[] | undefined) {
  if (!items?.length) {
    return null;
  }

  return items.reduce<string | null>((latestPublishedAt, item) => {
    if (Number.isNaN(Date.parse(item.publishedAt))) {
      return latestPublishedAt;
    }

    if (!latestPublishedAt) {
      return item.publishedAt;
    }

    return new Date(item.publishedAt).getTime() > new Date(latestPublishedAt).getTime()
      ? item.publishedAt
      : latestPublishedAt;
  }, null);
}

export function useNotificationsBadge(items: readonly PilgrimageNewsItem[] | undefined) {
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
  const latestPublishedAt = getLatestNotificationPublishedAt(items);

  useEffect(() => {
    let isMounted = true;

    const loadLastSeenAt = async () => {
      const storedValue = await readNotificationsLastSeenAt();

      if (isMounted) {
        setLastSeenAt(storedValue);
      }
    };

    void loadLastSeenAt();

    return () => {
      isMounted = false;
    };
  }, [latestPublishedAt]);

  const hasUnreadNotifications =
    Boolean(latestPublishedAt) &&
    (!lastSeenAt || new Date(latestPublishedAt as string).getTime() > new Date(lastSeenAt).getTime());

  return {
    hasUnreadNotifications,
    latestPublishedAt,
  };
}
