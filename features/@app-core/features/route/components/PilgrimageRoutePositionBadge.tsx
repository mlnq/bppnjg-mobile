import { Text, TouchableOpacity, View } from 'react-native';
import MapPinned from 'lucide-react-native/dist/esm/icons/map-pinned.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';

const { colors, typography } = pilgrimageRouteTheme;
const ROUTE_CHIP_BACKGROUND = colors.surfaceContainerLowest;
const ROUTE_CHIP_BORDER = colors.primaryContainer;
const ROUTE_CHIP_TEXT = colors.primary;

type PilgrimageRoutePositionBadgeProps = {
  label: string;
  onPress: () => void;
  className?: string;
};

export function PilgrimageRoutePositionBadge({
  label,
  onPress,
  className = 'mt-4 self-start',
}: PilgrimageRoutePositionBadgeProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`${className} rounded-full border px-3 py-2`}
      style={{ backgroundColor: ROUTE_CHIP_BACKGROUND, borderColor: ROUTE_CHIP_BORDER }}>
      <View className="flex-row items-center">
        <MapPinned size={14} color={ROUTE_CHIP_TEXT} strokeWidth={2.1} />
        <Text
          className="ml-2 text-[11px] font-bold uppercase tracking-[0.6px]"
          style={{ color: ROUTE_CHIP_TEXT, fontFamily: typography.fontFamily }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
