import type { ImageSourcePropType } from 'react-native';

export type PilgrimageStopAssetKey = 'd1_s0';
export type PilgrimageFallbackAssetKey = 'route_fallback';

const PILGRIMAGE_STOP_ASSETS: Record<PilgrimageStopAssetKey, ImageSourcePropType> = {
  d1_s0: require('../../../assets/pilgrimage/stops/d1_s0.webp'),
};

const PILGRIMAGE_FALLBACK_ASSETS: Record<PilgrimageFallbackAssetKey, ImageSourcePropType> = {
  route_fallback: require('../../../assets/pilgrimage/fallbacks/route_fallback.png'),
};

export const getPilgrimageStopAssetKey = (dayNumber: number, orderIndex: number) =>
  `d${dayNumber}_s${orderIndex}` as const;

export const getPilgrimageAssetSource = ({ stopAssetKey }: { stopAssetKey?: string | null }) => {
  if (stopAssetKey && stopAssetKey in PILGRIMAGE_STOP_ASSETS) {
    return PILGRIMAGE_STOP_ASSETS[stopAssetKey as PilgrimageStopAssetKey];
  }

  return PILGRIMAGE_FALLBACK_ASSETS.route_fallback;
};
