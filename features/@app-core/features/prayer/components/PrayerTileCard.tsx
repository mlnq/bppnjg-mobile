import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { CardButton } from '../../../components/Card';
import { useCompactStyles } from '../../../hooks/useCompactStyles';

const { colors, typography } = pilgrimageRouteTheme;

type PrayerTileCardProps = {
  icon: ReactNode;
  title: string;
  onPress?: () => void;
};

export function PrayerTileCard({ icon, title, onPress }: PrayerTileCardProps) {
  const { cs } = useCompactStyles();

  return (
    <CardButton
      disabled={!onPress}
      activeOpacity={0.8}
      onPress={onPress}
      className={cs(
        'min-h-[120px] flex-1 items-center justify-center rounded-[24px] border px-4 py-5',
        'min-h-[160px] flex-1 items-center justify-center rounded-[24px] border px-4 py-5'
      )}
      >
      <View className={cs('mb-5 items-center justify-center', 'mb-6 items-center justify-center')}>
        {icon}
      </View>
      <Text
        className={cs('text-center text-[16px] font-bold', 'text-center text-[18px] font-bold')}
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        {title}
      </Text>
    </CardButton>
  );
}
