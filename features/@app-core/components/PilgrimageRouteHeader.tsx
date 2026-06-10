import type { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ChevronLeft from 'lucide-react-native/dist/esm/icons/chevron-left.mjs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';

const { colors, typography } = pilgrimageRouteTheme;
const HEADER_CONTENT_HEIGHT = 72;
const HEADER_ACTION_SIZE = 44;

type PilgrimageRouteHeaderProps = {
  title: string;
  canGoBack: boolean;
  onBackPress: () => void;
  rightAction?: ReactNode;
};

export function PilgrimageRouteHeader({
  title,
  canGoBack,
  onBackPress,
  rightAction,
}: PilgrimageRouteHeaderProps) {
  const insets = useSafeAreaInsets();
  const actionTop = insets.top + (HEADER_CONTENT_HEIGHT - HEADER_ACTION_SIZE) / 2;

  return (
    <View
      className="relative border-b px-5"
      style={{
        height: HEADER_CONTENT_HEIGHT + insets.top,
        paddingTop: insets.top,
        backgroundColor: '#fcfaf7',
        borderBottomColor: '#e7ded4',
      }}>
      <View className="flex-1 flex-row items-center justify-center">
        <View className="flex-row items-center gap-2">
          <Text
            className="text-[24px] font-bold"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {title}
          </Text>
        </View>
      </View>

      {canGoBack ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onBackPress}
          className="absolute left-5 h-11 w-11 items-center justify-center rounded-full border"
          style={{
            top: actionTop,
            backgroundColor: '#ffffff',
            borderColor: '#e7ded4',
          }}>
          <ChevronLeft size={22} color={colors.onSurface} strokeWidth={2.2} />
        </TouchableOpacity>
      ) : null}

      {rightAction ? (
        <View className="absolute right-4" style={{ top: actionTop }}>
          {rightAction}
        </View>
      ) : null}
    </View>
  );
}
