import { useSyncExternalStore } from 'react';

import {
  getRouteFallbackModeSnapshot,
  subscribeRouteFallbackMode,
} from '../services/routeFallbackMode';

export function useRouteFallbackMode() {
  return useSyncExternalStore(subscribeRouteFallbackMode, getRouteFallbackModeSnapshot);
}
