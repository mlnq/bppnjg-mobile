import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import BookHeart from 'lucide-react-native/dist/esm/icons/book-heart.mjs';
import BookOpen from 'lucide-react-native/dist/esm/icons/book-open.mjs';
import ChevronRight from 'lucide-react-native/dist/esm/icons/chevron-right.mjs';
import Church from 'lucide-react-native/dist/esm/icons/church.mjs';
import Music4 from 'lucide-react-native/dist/esm/icons/music-4.mjs';

import {
  pilgrimageRouteTheme,
} from '../../../../../packages/@app-ui';
import { brewiarzApi } from '../../../services/brewiarzApi';
import { niedzielaApi } from '../../../services/niedzielaApi';
import type { AppDispatch } from '../../../store/store';
import { DailyReadingCard } from '../components/DailyReadingCard';
import { PrayerTileCard } from '../components/PrayerTileCard';
import { OFFICE_OPTIONS } from '../../breviary/helpers/pilgrimageBreviary.helpers';
import {
  PRAYER_TILES,
  getPrayerTilePressHandler,
  type PrayerTileIconName,
} from '../helpers/pilgrimagePrayer.helpers';

const { typography } = pilgrimageRouteTheme;

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
  const dispatch = useDispatch<AppDispatch>();

  useFocusEffect(
    useCallback(() => {
      dispatch(
        niedzielaApi.util.prefetch('getDailyReadings', undefined, {
          force: false,
        })
      );

      for (const { id } of OFFICE_OPTIONS) {
        dispatch(
          brewiarzApi.util.prefetch('getBreviaryOffice', id, {
            force: false,
          })
        );
      }
    }, [dispatch])
  );

  const getTileIcon = (iconName: PrayerTileIconName, color: string) => {
    if (iconName === 'hymnal') {
      return <Music4 size={40} color={color} strokeWidth={2.1} />;
    }

    if (iconName === 'readings') {
      return <BookOpen size={40} color={color} strokeWidth={2.1} />;
    }

    if (iconName === 'prayer-book') {
      return <BookHeart size={40} color={color} strokeWidth={2.1} />;
    }

    return <Church size={40} color={color} strokeWidth={2.1} />;
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: '#f3f5f8' }}
      contentContainerClassName="px-4 pt-5 pb-8"
      showsVerticalScrollIndicator={false}>
      <View className="flex-row flex-wrap justify-between gap-y-5">
        {PRAYER_TILES.map((tile) => (
          <View key={tile.id} className="basis-[48.5%]">
            <PrayerTileCard
              icon={getTileIcon(tile.iconName, tile.iconColor)}
              subtitle={tile.subtitle}
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

      <View className="mt-9">
        <DailyReadingCard />
      </View>

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
          <Music4 size={30} color="#842160" strokeWidth={2.1} />
        </View>
        <View className="flex-1">
          <Text
            className="text-[18px] font-bold"
            style={{ color: '#172033', fontFamily: typography.fontFamily }}>
            Pieśń pielgrzyma
          </Text>
          <Text
            className="mt-1 text-[15px]"
            style={{ color: '#6b7688', fontFamily: typography.fontFamily }}>
            Tradycyjna pieśń pielgrzymkowa
          </Text>
        </View>
        <ChevronRight size={26} color="#a7afbb" strokeWidth={2.1} />
      </TouchableOpacity>
    </ScrollView>
  );
}
