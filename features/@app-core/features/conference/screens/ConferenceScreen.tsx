import Markdown from 'react-native-markdown-display';
import { Text, TouchableOpacity, View } from 'react-native';

import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { getCurrentPilgrimageDayFetchNumber } from '../../../hooks/useSelectedPilgrimageDay';
import {
  PILGRIMAGE_YEAR,
  useGetPilgrimageDayQuery,
  useGetPilgrimageQuery,
} from '../../../services/pilgrimageApi';
import { formatDateLong } from '../../../utils/formatters/formatDateTime';

const { colors, typography } = pilgrimageRouteTheme;
const CONFERENCE_ACCENT = '#6f083f';
const CONFERENCE_ACCENT_SOFT = '#f6edf3';
const CONFERENCE_META_SOFT = '#f8f3f6';

const markdownStyles = {
  body: {
    color: colors.onSurfaceVariant,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    lineHeight: 28,
  },
  heading1: {
    color: CONFERENCE_ACCENT,
    fontFamily: typography.fontFamily,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800' as const,
    marginTop: 8,
    marginBottom: 20,
  },
  heading2: {
    color: '#4e0a2d',
    fontFamily: typography.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800' as const,
    marginTop: 24,
    marginBottom: 14,
  },
  heading3: {
    color: colors.onSurface,
    fontFamily: typography.fontFamily,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700' as const,
    marginTop: 20,
    marginBottom: 12,
  },
  heading4: {
    color: CONFERENCE_ACCENT,
    fontFamily: typography.fontFamily,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700' as const,
    marginTop: 18,
    marginBottom: 10,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 16,
  },
  strong: {
    color: colors.onSurface,
    fontWeight: '700' as const,
  },
  em: {
    color: colors.onSurface,
    fontStyle: 'italic' as const,
  },
  blockquote: {
    marginTop: 8,
    marginBottom: 20,
    paddingTop: 10,
    paddingRight: 14,
    paddingBottom: 10,
    paddingLeft: 14,
    borderLeftWidth: 3,
    borderLeftColor: CONFERENCE_ACCENT,
    backgroundColor: '#fffafc',
  },
  bullet_list: {
    marginTop: 6,
    marginBottom: 18,
  },
  ordered_list: {
    marginTop: 6,
    marginBottom: 18,
  },
  list_item: {
    color: colors.onSurfaceVariant,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    lineHeight: 27,
    marginBottom: 8,
  },
  bullet_list_icon: {
    color: CONFERENCE_ACCENT,
    marginRight: 8,
    marginTop: 4,
  },
  ordered_list_icon: {
    color: CONFERENCE_ACCENT,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  bullet_list_content: {
    color: colors.onSurfaceVariant,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    lineHeight: 27,
  },
  ordered_list_content: {
    color: colors.onSurfaceVariant,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    lineHeight: 27,
  },
  hr: {
    backgroundColor: '#ead9e3',
    height: 1,
    marginTop: 24,
    marginBottom: 24,
  },
  link: {
    color: CONFERENCE_ACCENT,
    textDecorationLine: 'underline' as const,
  },
  code_inline: {
    backgroundColor: CONFERENCE_ACCENT_SOFT,
    color: CONFERENCE_ACCENT,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
} as const;

export function PilgrimageConferenceScreen() {
  const {
    data: pilgrimage,
    isLoading: isPilgrimageLoading,
    isFetching: isPilgrimageFetching,
  } = useGetPilgrimageQuery(PILGRIMAGE_YEAR);
  const currentDayFetchNumber = getCurrentPilgrimageDayFetchNumber(pilgrimage?.totalDays);
  const {
    data: day,
    isLoading: isDayLoading,
    isFetching: isDayFetching,
  } = useGetPilgrimageDayQuery(
    {
      year: PILGRIMAGE_YEAR,
      dayNumber: currentDayFetchNumber ?? 1,
    },
    {
      skip: currentDayFetchNumber === null,
    }
  );
  const conference = day?.conference;

  return (
    <AppScreenScrollView
      className="flex-1"
      style={{ backgroundColor: AppColors.background }}
      contentContainerClassName="pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
  
      {isPilgrimageLoading || isPilgrimageFetching || isDayLoading || isDayFetching ? (
        <AppLoader label="Wczytywanie konferencji..." minHeight={320} />
      ) : !day ? (
        <Text
          className="mt-6 text-[16px] leading-7"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          Nie udało się pobrać aktualnego dnia pielgrzymki.
        </Text>
      ) : !conference ? (
        <View
          className="rounded-[28px] border px-5 py-5"
          style={{ backgroundColor: '#fff', borderColor: '#ece6ea' }}>
          <Text
            className="text-[24px] font-bold leading-8"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            Konferencja nie została jeszcze dodana
          </Text>
          <Text
            className="mt-3 text-[15px] leading-7"
            style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
            Dla dnia {day.dayNumber} nie ma jeszcze opublikowanej konferencji. Gdy pojawi się w panelu
            admina, zobaczysz ją tutaj automatycznie.
          </Text>
        </View>
      ) : (
        <View
          className="rounded-[28px] border px-5 py-5"
          style={{ backgroundColor: '#ffffff', borderColor: '#ece6ea' }}>
          <Text
            className="text-[13px] font-extrabold uppercase tracking-[1px]"
            style={{ color: CONFERENCE_ACCENT, fontFamily: typography.fontFamily }}>
            Dzień {day.dayNumber}
          </Text>
          <Text
            className="mt-2 text-[30px] font-bold leading-10"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {conference.title}
          </Text>

          <View className="mt-4 flex-row flex-wrap gap-2">
            <View
              className="rounded-full px-3 py-2"
              style={{ backgroundColor: CONFERENCE_META_SOFT }}>
              <Text
                className="text-[12px] font-medium"
                style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                {formatDateLong(conference.date)}
              </Text>
            </View>
            {conference.author ? (
              <View
                className="rounded-full px-3 py-2"
                style={{ backgroundColor: CONFERENCE_META_SOFT }}>
                <Text
                  className="text-[12px] font-medium"
                  style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                  Autor: {conference.author}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            className="mt-5 rounded-[22px] px-4 py-4"
            style={{ backgroundColor: '#ffffff' }}>
            <Markdown style={markdownStyles}>{conference.content}</Markdown>
          </View>
        </View>
      )}
    </AppScreenScrollView>
  );
}
