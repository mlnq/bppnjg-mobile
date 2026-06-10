import { notificationsApi } from './notificationsApi';
import { PILGRIMAGE_YEAR, pilgrimageApi } from './pilgrimageApi';
import { quartermasterApi } from './quartermasterApi';
import { getCurrentPilgrimageDayFetchNumber } from '../hooks/useSelectedPilgrimageDay';
import { store } from '../store/store';

type RefreshPilgrimageDataOptions = {
  includeNotifications?: boolean;
  includeQuartermaster?: boolean;
};

type RefreshRequest = {
  unwrap: () => Promise<unknown>;
  unsubscribe: () => void;
};

function dispatchNotificationsRefresh() {
  return store.dispatch(
    notificationsApi.endpoints.getPilgrimageNotifications.initiate(undefined, {
      forceRefetch: true,
      subscribe: false,
    })
  );
}

function dispatchQuartermasterRefresh() {
  return store.dispatch(
    quartermasterApi.endpoints.getQuartermasterComments.initiate(undefined, {
      forceRefetch: true,
      subscribe: false,
    })
  );
}

export async function refreshPilgrimageData(options: RefreshPilgrimageDataOptions = {}) {
  const requests: RefreshRequest[] = [];

  if (options.includeNotifications) {
    requests.push(dispatchNotificationsRefresh());
  }

  if (options.includeQuartermaster) {
    requests.push(dispatchQuartermasterRefresh());
  }

  try {
    await Promise.all(requests.map((request) => request.unwrap()));
  } finally {
    requests.forEach((request) => {
      request.unsubscribe();
    });
  }
}

export function prefetchPilgrimageNotifications(force = false) {
  store.dispatch(
    notificationsApi.util.prefetch('getPilgrimageNotifications', undefined, {
      force,
    })
  );
}

export function prefetchPilgrimageHomeData(force = false) {
  const currentDayFetchNumber = getCurrentPilgrimageDayFetchNumber(14) ?? 1;

  store.dispatch(
    pilgrimageApi.util.prefetch('getPilgrimage', PILGRIMAGE_YEAR, {
      force,
    })
  );
  store.dispatch(
    pilgrimageApi.util.prefetch(
      'getPilgrimageDay',
      { year: PILGRIMAGE_YEAR, dayNumber: currentDayFetchNumber },
      {
        force,
      }
    )
  );
  store.dispatch(
    quartermasterApi.util.prefetch('getQuartermasterComments', undefined, {
      force,
    })
  );
  prefetchPilgrimageNotifications(force);
}
