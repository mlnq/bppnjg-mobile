import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import {
  getPrayerBookEntryById,
  loadPrayerBookEntryBody,
  type PrayerBookEntryId,
} from '../helpers/pilgrimagePrayerBook.helpers';

const { colors, typography } = pilgrimageRouteTheme;
const PRAYER_BOOK_ACCENT = '#16A34A';
const PRAYER_BOOK_ACCENT_SOFT = '#ECFDF3';
const PRAYER_BOOK_ACCENT_BORDER = '#BBF7D0';

type PilgrimagePrayerBookEntryScreenProps = {
  entryId: PrayerBookEntryId;
  onBack: () => void;
};

export function PilgrimagePrayerBookEntryScreen({
  entryId,
  onBack,
}: PilgrimagePrayerBookEntryScreenProps) {
  const entry = getPrayerBookEntryById(entryId);
  const [body, setBody] = useState('');
  const [isLoadingBody, setIsLoadingBody] = useState(false);
  const [bodyError, setBodyError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBody = async () => {
      setIsLoadingBody(true);
      setBodyError(null);

      try {
        const nextBody = await loadPrayerBookEntryBody(entryId);

        if (!isMounted) {
          return;
        }

        setBody(nextBody);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setBody('');
        setBodyError(
          error instanceof Error ? error.message : 'Nie udało się wczytać treści modlitwy.'
        );
      } finally {
        if (isMounted) {
          setIsLoadingBody(false);
        }
      }
    };

    void loadBody();

    return () => {
      isMounted = false;
    };
  }, [entryId]);

  if (!entry) {
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
            Wróć do modlitewnika
          </Text>
        </TouchableOpacity>
        <Text
          className="text-[16px] leading-7"
          style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
          Nie znaleziono wybranej modlitwy.
        </Text>
      </ScrollView>
    );
  }

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
          Wróć do modlitewnika
        </Text>
      </TouchableOpacity>

      <Text
        className="text-[28px] font-bold"
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        {entry.title}
      </Text>
      <Text
        className="mt-2 text-[16px] leading-6"
        style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
        {entry.subtitle}
      </Text>

      <View
        className="mt-6 rounded-[24px] border px-5 py-5"
        style={{
          borderColor: PRAYER_BOOK_ACCENT_BORDER,
          borderRadius: 24,
          backgroundColor: '#ffffff',
        }}>
        {isLoadingBody ? (
          <AppLoader compact label="Wczytywanie treści modlitwy..." minHeight={96} />
        ) : bodyError ? (
          <Text
            className="text-[16px] leading-7"
            style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
            {bodyError}
          </Text>
        ) : (
          <Markdown
            style={{
              body: {
                color: colors.onSurfaceVariant,
                fontFamily: typography.fontFamily,
                fontSize: 16,
                lineHeight: 26,
              },
              strong: {
                color: PRAYER_BOOK_ACCENT,
                fontFamily: typography.fontFamily,
                fontWeight: '700',
              },
              bullet_list: {
                marginTop: 8,
                marginBottom: 8,
              },
              list_item: {
                color: colors.onSurfaceVariant,
                fontFamily: typography.fontFamily,
                fontSize: 16,
                lineHeight: 26,
              },
              paragraph: {
                marginTop: 0,
                marginBottom: 12,
              },
            }}>
            {body}
          </Markdown>
        )}
      </View>
    </ScrollView>
  );
}
