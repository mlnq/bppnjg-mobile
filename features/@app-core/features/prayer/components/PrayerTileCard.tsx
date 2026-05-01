import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';

const { colors, typography } = pilgrimageRouteTheme;

type PrayerTileCardProps = {
  icon: ReactNode;
  subtitle: string;
  title: string;
  onPress?: () => void;
};

export function PrayerTileCard({ icon, subtitle, title, onPress }: PrayerTileCardProps) {
  return (
    <TouchableOpacity
      disabled={!onPress}
      activeOpacity={0.8}
      onPress={onPress}
      className="min-h-[258px] flex-1 items-center justify-center rounded-[26px] border px-5 py-6"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#ececf0',
        borderRadius: 26,
        shadowColor: '#1c2433',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      <View className="mb-8 items-center justify-center">
        {icon}
      </View>
      <Text
        className="mb-2 text-center text-[23px] font-bold"
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        {title}
      </Text>
      <Text
        className="text-center text-[15px] leading-7"
        style={{ color: '#586577', fontFamily: typography.fontFamily, maxWidth: 170 }}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}
