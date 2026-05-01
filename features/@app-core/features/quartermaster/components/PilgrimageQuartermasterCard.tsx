import { Text, TouchableOpacity, View } from 'react-native';

import { PrayerHandsIcon, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { QuartermasterComment } from '../../../services/quartermasterApi';

const { colors, typography } = pilgrimageRouteTheme;

function formatPublishedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Bez daty';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

type PilgrimageQuartermasterCardProps = {
  item: QuartermasterComment;
  onPress?: (item: QuartermasterComment) => void;
};

export function PilgrimageQuartermasterCard({ item, onPress }: PilgrimageQuartermasterCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress ? () => onPress(item) : undefined}
      className="rounded-[24px] border bg-[#fbf7f2] px-5 py-5"
      style={{ borderColor: '#ead9c8' }}>
      <View className="flex-row items-start gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-[18px] bg-white">
          <PrayerHandsIcon size={24} color="#9f6a2e" />
        </View>

        <View className="flex-1 pr-2">
          <Text
            className="mb-1 text-[11px] font-medium uppercase tracking-[0.8px]"
            style={{ color: '#8f9298', fontFamily: typography.fontFamily }}>
            DZIEŃ {item.dayNumber ?? '?'} • {formatPublishedAt(item.publishedAt)}
          </Text>
          <Text
            className="text-[18px] font-medium leading-7"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {item.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
