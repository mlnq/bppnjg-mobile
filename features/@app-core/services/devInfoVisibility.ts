import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_INFO_VISIBILITY_KEY = 'dev_info_visibility_enabled';

export type DevInfoVisibilityState = {
  isEnabled: boolean;
  isHydrated: boolean;
};

const state: DevInfoVisibilityState = {
  isEnabled: false,
  isHydrated: false,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

async function hydrateDevInfoVisibility() {
  try {
    const storedValue = await AsyncStorage.getItem(DEV_INFO_VISIBILITY_KEY);
    state.isEnabled = storedValue === 'true';
  } finally {
    state.isHydrated = true;
    notify();
  }
}

void hydrateDevInfoVisibility();

export function getDevInfoVisibilitySnapshot() {
  return state;
}

export function subscribeDevInfoVisibility(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export async function setDevInfoVisibilityEnabled(isEnabled: boolean) {
  state.isEnabled = isEnabled;
  notify();

  await AsyncStorage.setItem(DEV_INFO_VISIBILITY_KEY, String(isEnabled));
}

export async function enableDevInfoVisibility() {
  if (state.isEnabled) {
    return;
  }

  await setDevInfoVisibilityEnabled(true);
}

export async function resetDevInfoVisibility() {
  await setDevInfoVisibilityEnabled(false);
}
