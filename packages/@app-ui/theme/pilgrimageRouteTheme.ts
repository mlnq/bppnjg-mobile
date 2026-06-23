import { AppColors } from './colors';

export const pilgrimageRouteTheme = {
  name: 'PilgrimageRoute',
  colors: AppColors,
  spacing: {
    xs: 4,
    sm: 12,
    md: 24,
    lg: 48,
    xl: 80,
  },
  radii: {
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    fontFamily: 'Manrope',
  },
} as const;
