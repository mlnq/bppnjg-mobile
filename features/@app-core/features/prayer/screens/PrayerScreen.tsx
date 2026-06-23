import { Text, TouchableOpacity, View } from 'react-native';
import BookHeart from 'lucide-react-native/dist/esm/icons/book-heart.mjs';
import BookOpen from 'lucide-react-native/dist/esm/icons/book-open.mjs';
import ChevronRight from 'lucide-react-native/dist/esm/icons/chevron-right.mjs';
import Church from 'lucide-react-native/dist/esm/icons/church.mjs';
import Music4 from 'lucide-react-native/dist/esm/icons/music-4.mjs';

import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { useCompactStyles } from '../../../hooks/useCompactStyles';
import { DailyReadingCard } from '../components/DailyReadingCard';
import { PrayerTileCard } from '../components/PrayerTileCard';
import {
  PRAYER_TILES,
  getPrayerTilePressHandler,
  type PrayerTileIconName,
} from '../helpers/pilgrimagePrayer.helpers';

const { typography } = pilgrimageRouteTheme;
const PRAYER_ICON_STROKE_WIDTH = 1.7;

type PilgrimagePrayerScreenProps = {
  onNavigateToBreviary: () => void;
  onNavigateToReadings: () => void;
  onNavigateToPrayerBook: () => void;
};

export function PilgrimagePrayerScreen({
  onNavigateToBreviary,
  onNavigateToReadings,
  onNavigateToPrayerBook,
}: PilgrimagePrayerScreenProps) {
  const { cs } = useCompactStyles();

  const getTileIcon = (iconName: PrayerTileIconName, color: string) => {
    if (iconName === 'hymnal') {
      return <Music4 size={40} color={color} strokeWidth={PRAYER_ICON_STROKE_WIDTH} />;
    }

    if (iconName === 'readings') {
      return <BookOpen size={40} color={color} strokeWidth={PRAYER_ICON_STROKE_WIDTH} />;
    }

    if (iconName === 'prayer-book') {
      return <BookHeart size={40} color={color} strokeWidth={PRAYER_ICON_STROKE_WIDTH} />;
    }

    return <Church size={40} color={color} strokeWidth={PRAYER_ICON_STROKE_WIDTH} />;
  };

  return (
    <AppScreenScrollView
      className="flex-1"
      style={{ backgroundColor: AppColors.background }}
      contentContainerClassName="pt-5 pb-8"
      showsVerticalScrollIndicator={false}>
      <View className="flex-row flex-wrap justify-between gap-y-5">
        {PRAYER_TILES.map((tile) => (
          <View key={tile.id} className="basis-[48.5%]">
            <PrayerTileCard
              icon={getTileIcon(tile.iconName, tile.iconColor)}
              title={tile.title}
              onPress={getPrayerTilePressHandler(tile.id, {
                onNavigateToBreviary,
                onNavigateToReadings,
                onNavigateToPrayerBook,
              })}
            />
          </View>
        ))}
      </View>


      {/* <View className="mt-9">
        <DailyReadingCard />
      </View> */}

      <TouchableOpacity
        activeOpacity={0.8}
        className="mt-9 flex-row items-center rounded-[24px] border px-6 py-6"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#ececf0',
          shadowColor: '#1c2433',
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}>
        <View className="mr-4">
          <Music4 size={30} color="#842160" strokeWidth={PRAYER_ICON_STROKE_WIDTH} />
        </View>
        <View className="flex-1">
          <Text
            className={cs('text-[17px] font-bold', 'text-[18px] font-bold')}
            style={{ color: '#172033', fontFamily: typography.fontFamily }}>
            Pieśń pielgrzyma
          </Text>
          <Text
            className={cs('mt-1 text-[14px]', 'mt-1 text-[15px]')}
            style={{ color: '#6b7688', fontFamily: typography.fontFamily }}>
            Pieśń pielgrzymkowa na Jasnej Górze
          </Text>
        </View>
        <ChevronRight size={26} color="#a7afbb" strokeWidth={1.8} />
      </TouchableOpacity>
    </AppScreenScrollView>
  );
}
