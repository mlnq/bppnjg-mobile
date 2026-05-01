import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { pilgrimageRouteTheme, PrayerBookIcon } from '../../../../../packages/@app-ui';
import {
  PRAYER_BOOK_ENTRIES,
} from '../helpers/pilgrimagePrayerBook.helpers';

const { colors, typography } = pilgrimageRouteTheme;
const PRAYER_BOOK_ACCENT = '#16A34A';
const PRAYER_BOOK_ACCENT_SOFT = '#ECFDF3';
const PRAYER_BOOK_ACCENT_BORDER = '#BBF7D0';

type PilgrimagePrayerBookScreenProps = {
  onBack: () => void;
  onSelectEntry: (entryId: (typeof PRAYER_BOOK_ENTRIES)[number]['id']) => void;
};

export function PilgrimagePrayerBookScreen({ onBack, onSelectEntry }: PilgrimagePrayerBookScreenProps) {
  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="px-4 pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
      <TouchableOpacity activeOpacity={0.75} onPress={onBack}>
        <Text
          className="mb-5 text-[15px] font-semibold"
          style={{ color: PRAYER_BOOK_ACCENT, fontFamily: typography.fontFamily }}>
          Wróć do niezbędnika
        </Text>
      </TouchableOpacity>

      <Text
        className="text-[28px] font-bold"
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        Modlitewnik
      </Text>
      <Text
        className="mt-2 text-[16px] leading-6"
        style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
        Wybierz modlitwę lub nabożeństwo przygotowane na drogę.
      </Text>

      <View className="mt-6 gap-3">
        {PRAYER_BOOK_ENTRIES.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            activeOpacity={0.85}
            onPress={() => onSelectEntry(entry.id)}
            className="rounded-[22px] border px-5 py-5"
            style={{
              backgroundColor: '#ffffff',
              borderColor: PRAYER_BOOK_ACCENT_BORDER,
            }}>
            <View className="mb-4 flex-row items-center">
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
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
