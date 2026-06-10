import { useSelector } from 'react-redux';

import type { RootState } from '../store/store';

export function useRouteLocationSource() {
  const value = useSelector((state: RootState) => state.preferences.routeLocationSource);

  return {
    value,
    isHydrated: true,
  };
}
