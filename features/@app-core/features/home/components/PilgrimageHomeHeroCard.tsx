import { Text, TouchableOpacity, View } from 'react-native';
import MapPinned from 'lucide-react-native/dist/esm/icons/map-pinned.mjs';
import { Image } from 'expo-image';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';

const { colors, typography } = pilgrimageRouteTheme;
const ROUTE_CHIP_BACKGROUND = colors.primaryContainer;
const HERO_CARD_IMAGE = require('../../../../../assets/pilgrimage/day-covers/day-01-bialystok-katedra.png');
const HERO_CARD_BORDER = colors.outlineVariant;
const HERO_PROGRESS_FILL = colors.primary;

type PilgrimageHomeHeroCardProps = {
  remainingDistanceLabel: string;
  dayLabel: string;
  routeLabel: string;
  onOpenInfo: () => void;
};

export function PilgrimageHomeHeroCard({
  remainingDistanceLabel,
  dayLabel,
  routeLabel,
  onOpenInfo,
}: PilgrimageHomeHeroCardProps) {
  return (
    <View
      className="mt-4 w-full overflow-hidden rounded-[30px] border"
      style={{
        aspectRatio: 0.84,
        backgroundColor: colors.surfaceContainerLowest,
        borderColor: HERO_CARD_BORDER,
        shadowColor: colors.onSurface,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      <View className="flex-[6] overflow-hidden rounded-t-[30px]">
        <Image
          source={HERO_CARD_IMAGE}
          transition={0}
          cachePolicy="memory-disk"
          contentFit="cover"
          style={{ height: '100%', width: '100%' }}
        />
      </View>

      <View className="flex-[4] px-6 pb-5 pt-5">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text
              className="self-start rounded-full px-3 py-[6px] text-[11px] font-bold uppercase tracking-[1px]"
              style={{ color: colors.primary, backgroundColor: ROUTE_CHIP_BACKGROUND, fontFamily: typography.fontFamily }}>
              {dayLabel}
            </Text>
            <Text
              className="mt-4 text-[30px] font-bold leading-[32px]"
              style={{ color: HERO_PROGRESS_FILL, fontFamily: typography.fontFamily }}>
              {remainingDistanceLabel}
            </Text>
            <Text
              className="mt-2 text-[12px] font-bold uppercase tracking-[1px]"
              style={{ color: HERO_PROGRESS_FILL, fontFamily: typography.fontFamily }}>
              do celu
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenInfo}
            className="h-[42px] w-[42px] items-center justify-center rounded-full"
            style={{ backgroundColor: ROUTE_CHIP_BACKGROUND }}>
            <MapPinned size={18} color={colors.primary} strokeWidth={1.9} />
          </TouchableOpacity>
        </View>

        <View className="mt-5">
          <Text
            className="text-[24px] font-bold leading-[31px]"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {routeLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}
