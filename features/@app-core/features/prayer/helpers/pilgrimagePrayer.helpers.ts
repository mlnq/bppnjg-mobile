export type PrayerTileId = 'hymnal' | 'readings' | 'prayer-book' | 'breviary';
export type PrayerTileIconName = 'hymnal' | 'readings' | 'prayer-book' | 'breviary';

export type PrayerTileDefinition = {
  id: PrayerTileId;
  title: string;
  subtitle: string;
  iconName: PrayerTileIconName;
  iconColor: string;
};

export const PRAYER_TILES: readonly PrayerTileDefinition[] = [
  {
    id: 'hymnal',
    title: 'Śpiewnik',
    subtitle: 'Pieśni na dziś',
    iconName: 'hymnal',
    iconColor: '#842160',
  },
  {
    id: 'readings',
    title: 'Czytania',
    subtitle: 'Czytania z Mszy dzisiejszej',
    iconName: 'readings',
    iconColor: '#D97706',
  },
  {
    id: 'prayer-book',
    title: 'Modlitewnik',
    subtitle: 'Modlitwy codzienne',
    iconName: 'prayer-book',
    iconColor: '#16A34A',
  },
  {
    id: 'breviary',
    title: 'Brewiarz',
    subtitle: 'Liturgia godzin',
    iconName: 'breviary',
    iconColor: '#2563EB',
  },
] as const;

export function getPrayerTilePressHandler(
  tileId: PrayerTileId,
  handlers: {
    onNavigateToBreviary: () => void;
    onNavigateToReadings: () => void;
    onNavigateToPrayerBook: () => void;
  }
) {
  if (tileId === 'readings') {
    return handlers.onNavigateToReadings;
  }

  if (tileId === 'breviary') {
    return handlers.onNavigateToBreviary;
  }

  if (tileId === 'prayer-book') {
    return handlers.onNavigateToPrayerBook;
  }

  return undefined;
}
