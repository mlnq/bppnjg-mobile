import { useSyncExternalStore } from 'react';

import {
  getDevInfoVisibilitySnapshot,
  subscribeDevInfoVisibility,
} from '../services/devInfoVisibility';

export function useDevInfoVisibility() {
  return useSyncExternalStore(subscribeDevInfoVisibility, getDevInfoVisibilitySnapshot);
}
