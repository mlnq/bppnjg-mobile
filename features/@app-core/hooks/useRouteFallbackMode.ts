import { useSelector } from 'react-redux';

import type { RootState } from '../store/store';

export function useRouteFallbackMode() {
  const isEnabled = useSelector((state: RootState) => state.preferences.isRouteFallbackModeEnabled);

  return {
    isEnabled,
    isHydrated: true,
  };
}
