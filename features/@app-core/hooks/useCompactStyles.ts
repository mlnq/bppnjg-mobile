import { useWindowDimensions } from 'react-native';

const COMPACT_SCREEN_MAX_WIDTH = 390;

export function useIsCompactScreen() {
  const { width } = useWindowDimensions();

  return width <= COMPACT_SCREEN_MAX_WIDTH;
}

export function useCompactStyles() {
  const isCompact = useIsCompactScreen();

  return {
    isCompact,
    cs: (compact: string, normal: string) => (isCompact ? compact : normal),
  };
}
