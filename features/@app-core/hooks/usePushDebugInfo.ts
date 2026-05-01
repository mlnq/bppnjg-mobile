import { useSyncExternalStore } from 'react';

import {
  getPushDebugInfoSnapshot,
  subscribePushDebugInfo,
} from '../services/pushDebugInfo';

export function usePushDebugInfo() {
  return useSyncExternalStore(subscribePushDebugInfo, getPushDebugInfoSnapshot);
}
