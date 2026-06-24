import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import ChevronRight from 'lucide-react-native/dist/esm/icons/chevron-right.mjs';

import { AppColors, pilgrimageRouteTheme, PrayerBookIcon } from '../../../../../packages/@app-ui';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { useCompactStyles } from '../../../hooks/useCompactStyles';
import {
  PRAYER_BOOK_ENTRIES,
} from '../helpers/pilgrimagePrayerBook.helpers';

const { colors, typography } = pilgrimageRouteTheme;
const PRAYER_BOOK_ACCENT = '#16A34A';
const PRAYER_BOOK_ACCENT_SOFT = '#ECFDF3';
const PRAYER_BOOK_ACCENT_BORDER = '#BBF7D0';
const CHEVRON_COLOR = '#a7afbb';

export function PilgrimagePrayerBookScreen() {
  const router = useRouter();
  const { cs, isCompact } = useCompactStyles();

  return (
    <AppScreenScrollView
      className="flex-1"
      style={{ backgroundColor: AppColors.background }}
      contentContainerClassName="pt-6 pb-6"
      showsVerticalScrollIndicator={false}
      withoutBottomNav>

      <Text
        className={cs('text-[22px] font-bold', 'text-[28px] font-bold')}
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        Modlitewnik
      </Text>
      <Text
        className={cs('mt-2 text-[14px] leading-5', 'mt-2 text-[16px] leading-6')}
        style={{
          color: colors.onSurfaceVariant,
          fontFamily: typography.fontFamily,
          fontSize: isCompact ? 14 : 16,
          lineHeight: isCompact ? 20 : 24,
        }}>
        Zbior najpotrzebniejszych modlitw na droge i wspolna modlitwe pielgrzymki.
      </Text>

      <View className="mt-8 gap-3">
        {PRAYER_BOOK_ENTRIES.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            activeOpacity={0.85}
            onPress={() => router.push(`/prayer-book/${entry.id}`)}
            className="rounded-[22px] border px-5 py-5"
            style={{
              backgroundColor: '#ffffff',
              borderColor: PRAYER_BOOK_ACCENT_BORDER,
            }}>
            <View className="flex-row items-center">
              <View
                className="mr-4 h-[52px] w-[52px] items-center justify-center rounded-[18px]"
                style={{ backgroundColor: PRAYER_BOOK_ACCENT_SOFT }}>
                <PrayerBookIcon size={24} color={PRAYER_BOOK_ACCENT} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-[19px] font-medium"
                  style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
                  {entry.title}
                </Text>
                <Text
                  className="mt-1 text-[14px] leading-5"
                  style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                  {entry.subtitle}
                </Text>
              </View>
              <ChevronRight size={22} color={CHEVRON_COLOR} strokeWidth={1.8} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </AppScreenScrollView>
  );
}
