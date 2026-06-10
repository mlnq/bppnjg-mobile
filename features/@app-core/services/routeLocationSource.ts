import AsyncStorage from '@react-native-async-storage/async-storage';

const ROUTE_LOCATION_SOURCE_KEY = 'route_location_source';

export type LocationSource = 'auto' | 'gps-only' | 'time-only';

export type RouteLocationSourceState = {
  value: LocationSource;
  isHydrated: boolean;
};

let state: RouteLocationSourceState = {
  value: 'auto',
  isHydrated: false,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

async function hydrateRouteLocationSource() {
  try {
    const storedValue = await AsyncStorage.getItem(ROUTE_LOCATION_SOURCE_KEY);

    if (storedValue === 'auto' || storedValue === 'gps-only' || storedValue === 'time-only') {
      state = { ...state, value: storedValue };
    }
  } finally {
    state = { ...state, isHydrated: true };
    notify();
  }
}

void hydrateRouteLocationSource();

export function getRouteLocationSourceSnapshot() {
  return state;
}

export function subscribeRouteLocationSource(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export async function setRouteLocationSource(value: LocationSource) {
  if (state.value === value) {
    return;
  }

  state = { ...state, value };
  notify();

  await AsyncStorage.setItem(ROUTE_LOCATION_SOURCE_KEY, value);
}
