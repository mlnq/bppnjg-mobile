import { Text, TouchableOpacity, View } from 'react-native';
import ChevronRight from 'lucide-react-native/dist/esm/icons/chevron-right.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { QuartermasterComment } from '../../../services/quartermasterApi';
import { formatDateTimeShort } from '../../../utils/formatters/formatDateTime';

const { colors, typography } = pilgrimageRouteTheme;
const CARD_BORDER = '#f2ebe3';
const BADGE_BACKGROUND = '#7d2d40';
const BADGE_TEXT = '#fff7f8';
const CHEVRON_BACKGROUND = '#fbf5ef';
const CHEVRON_COLOR = '#c8b7aa';

type PilgrimageQuartermasterCardProps = {
  item: QuartermasterComment;
  onPress?: (item: QuartermasterComment) => void;
};

export function PilgrimageQuartermasterCard({ item, onPress }: PilgrimageQuartermasterCardProps) {
  const dayLabel =
    typeof item.dayNumber === 'number' ? `DZIEŃ ${String(item.dayNumber).padStart(2, '0')}` : 'DZIEŃ';

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress ? () => onPress(item) : undefined}
      className="rounded-[24px] border bg-white px-5 py-[18px]"
      style={{
        borderColor: CARD_BORDER,
        shadowColor: '#9d8d7f',
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
      }}>
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <View className="mb-3 flex-row items-center gap-2">
            <View
              className="rounded-full px-[10px] py-[5px]"
              style={{ backgroundColor: BADGE_BACKGROUND }}>
              <Text
                className="text-[10px] font-bold uppercase tracking-[0.9px]"
                style={{ color: BADGE_TEXT, fontFamily: typography.fontFamily }}>
                {dayLabel}
              </Text>
            </View>
            <Text
              className="text-[10px] font-medium"
              style={{ color: '#9a9086', fontFamily: typography.fontFamily }}>
              {formatDateTimeShort(item.publishedAt)}
            </Text>
          </View>

          <Text
            className="pr-3 text-[17px] font-bold leading-6"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {item.title}
          </Text>
        </View>

        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: CHEVRON_BACKGROUND }}>
          <ChevronRight size={18} color={CHEVRON_COLOR} strokeWidth={2.4} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
