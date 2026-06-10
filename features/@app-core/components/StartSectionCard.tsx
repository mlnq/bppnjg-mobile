import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import ChevronRight from 'lucide-react-native/dist/esm/icons/chevron-right.mjs';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { CardButton } from './Card';

const { colors, typography } = pilgrimageRouteTheme;
const START_SECTION_SOFT_PRIMARY = colors.primaryContainer;

type StartSectionCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  backgroundColor?: string;
  iconBackgroundColor?: string;
  accentColor?: string;
  onPress?: () => void;
};

export function StartSectionCard({
  icon,
  title,
  subtitle,
  backgroundColor = colors.surfaceContainerLowest,
  iconBackgroundColor = START_SECTION_SOFT_PRIMARY,
  accentColor = colors.primary,
  onPress,
}: StartSectionCardProps) {
  return (
    <CardButton
      disabled={!onPress}
      activeOpacity={onPress ? 0.82 : 1}
      onPress={onPress}
      className="mt-5 flex-row items-center rounded-[24px] border px-5 py-5"
      backgroundColor={backgroundColor}
      borderColor={colors.outlineVariant}>
      <View
        className="mr-4 h-[56px] w-[56px] items-center justify-center rounded-[18px]"
        style={{ backgroundColor: iconBackgroundColor }}>
        {icon}
      </View>

      <View className="flex-1 pr-3">
        <Text
          className="text-[17px] font-bold leading-6"
          numberOfLines={2}
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          {title}
        </Text>
        <Text
          className="mt-1 text-[14px] font-medium leading-5"
          numberOfLines={2}
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          {subtitle}
        </Text>
      </View>

      <ChevronRight size={22} color={accentColor} strokeWidth={1.8} />
    </CardButton>
  );
}
