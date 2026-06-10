import { useState } from 'react';

import { refreshPilgrimageData } from '../services/pilgrimageDataRefresh';

type UsePilgrimageRefreshOptions = {
  includeNotifications?: boolean;
  includeQuartermaster?: boolean;
  additionalRefreshTasks?: Array<() => Promise<unknown>>;
};

export function usePilgrimageRefresh(options: UsePilgrimageRefreshOptions = {}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);

    try {
      await refreshPilgrimageData(options);

      if (options.additionalRefreshTasks?.length) {
        await Promise.all(options.additionalRefreshTasks.map((task) => task()));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    refresh,
  };
}
