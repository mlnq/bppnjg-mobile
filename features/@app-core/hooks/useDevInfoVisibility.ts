import { useSelector } from 'react-redux';

import type { RootState } from '../store/store';

export function useDevInfoVisibility() {
  const isEnabled = useSelector((state: RootState) => state.preferences.isDevInfoVisible);

  return {
    isEnabled,
    isHydrated: true,
  };
}
