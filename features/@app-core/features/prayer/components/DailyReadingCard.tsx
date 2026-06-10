import { Text, View } from 'react-native';
import BookOpen from 'lucide-react-native/dist/esm/icons/book-open.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import {
  DEFAULT_BIBLE_TRANSLATION,
  useGetBibleInfoQuery,
  useGetVersesQuery,
} from '../../../services/bibliaApi';
import { Card } from '../../../components/Card';
import { AppLoader } from '../../../components/AppLoader';
import { useCompactStyles } from '../../../hooks/useCompactStyles';

const { colors, typography } = pilgrimageRouteTheme;
const CARD_ICON_STROKE_WIDTH = 1.7;

export function DailyReadingCard() {
  const { cs } = useCompactStyles();
  const bible = DEFAULT_BIBLE_TRANSLATION;
  const {
    data: verseData,
    isLoading: isVerseLoading,
    isFetching: isVerseFetching,
    isError: isVerseError,
  } = useGetVersesQuery({
    bible,
    book: 'j',
    chapter: 3,
    verses: '16',
  });
  const { data: bibleInfo } = useGetBibleInfoQuery(bible);

  const verse = verseData?.verses[0];
  const translationName = bibleInfo?.name ?? 'Biblia Tysiąclecia';

  return (
    <Card
      className="rounded-[28px] border px-6 py-6"
      >
      <View className="flex-row items-center">
        <View
          className="mr-4 h-[48px] w-[48px] items-center justify-center rounded-[16px]"
          style={{ backgroundColor: '#f6dfea' }}>
          <BookOpen size={24} color="#842160" strokeWidth={CARD_ICON_STROKE_WIDTH} />
        </View>
        <View className="flex-1">
          <Text
            className={cs('text-[17px] font-bold', 'text-[18px] font-bold')}
            style={{ color: '#172033', fontFamily: typography.fontFamily }}>
            Biblia API
          </Text>
          <Text
            className={cs('mt-1 text-[14px]', 'mt-1 text-[15px]')}
            style={{ color: '#6b7688', fontFamily: typography.fontFamily }}>
            Czytanie z {translationName}
          </Text>
        </View>
      </View>
      <View
        className="mt-6 rounded-[22px] px-5 py-5"
        style={{ backgroundColor: '#fdf1f5', borderRadius: 22 }}>
        <Text
          className={cs('text-[13px] font-semibold', 'text-[14px] font-semibold')}
          style={{ color: '#842160', fontFamily: typography.fontFamily }}>
          J 3,16
        </Text>

        {isVerseLoading || isVerseFetching ? (
          <View className="mt-3">
            <AppLoader compact label="Pobieranie tekstu..." minHeight={72} />
          </View>
        ) : isVerseError ? (
          <Text
            className="mt-3 text-[16px] leading-7"
            style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
            Nie udało się pobrać wersetu z API.
          </Text>
        ) : (
          <>
            <Text
              className={cs('mt-4 text-[16px] italic leading-7', 'mt-4 text-[18px] italic leading-8')}
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {verse?.text}
            </Text>
            <Text
              className={cs('mt-4 text-[12px] font-medium', 'mt-4 text-[13px] font-medium')}
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {verseData?.book.name} {verseData?.chapter}:{verse?.verse}
            </Text>
          </>
        )}
      </View>
    </Card>
  );
}
