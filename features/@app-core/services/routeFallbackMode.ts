import AsyncStorage from '@react-native-async-storage/async-storage';

const ROUTE_FALLBACK_MODE_KEY = 'route_fallback_mode_enabled';

export type RouteFallbackModeState = {
  isEnabled: boolean;
  isHydrated: boolean;
};

let state: RouteFallbackModeState = {
  isEnabled: false,
  isHydrated: false,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

async function hydrateRouteFallbackMode() {
  try {
    const storedValue = await AsyncStorage.getItem(ROUTE_FALLBACK_MODE_KEY);
    state = { ...state, isEnabled: storedValue === 'true' };
  } finally {
    state = { ...state, isHydrated: true };
    notify();
  }
}

void hydrateRouteFallbackMode();

export function getRouteFallbackModeSnapshot() {
  return state;
}

export function subscribeRouteFallbackMode(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export async function setRouteFallbackModeEnabled(isEnabled: boolean) {
  if (state.isEnabled === isEnabled) {
    return;
  }

  state = { ...state, isEnabled };
  notify();

  await AsyncStorage.setItem(ROUTE_FALLBACK_MODE_KEY, String(isEnabled));
}

export async function toggleRouteFallbackMode() {
  await setRouteFallbackModeEnabled(!state.isEnabled);
}
