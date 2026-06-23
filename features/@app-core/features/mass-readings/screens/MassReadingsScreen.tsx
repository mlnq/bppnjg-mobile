import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { useCompactStyles } from '../../../hooks/useCompactStyles';
import {
  ReadingFontSizeControl,
  type ReadingFontScale,
} from '../../../components/ReadingFontSizeControl';
import { AppLoader } from '../../../components/AppLoader';
import { useGetDailyReadingsQuery } from '../../../services/niedzielaApi';
import { formatDate } from '../../../utils/formatters/formatDate';
import { ReadingCard } from '../components/ReadingCard';

const { colors, typography } = pilgrimageRouteTheme;
const READINGS_ACCENT = '#D97706';
const READINGS_ACCENT_SOFT = '#FFF7E6';
const READINGS_ACCENT_BORDER = '#FCD34D';

export function PilgrimageMassReadingsScreen() {
  const { data, isLoading, isFetching, isError } = useGetDailyReadingsQuery();
  const [fontScale, setFontScale] = useState<ReadingFontScale>(1);
  const { cs, isCompact } = useCompactStyles();

  return (
    <AppScreenScrollView
      className="flex-1"
      style={{ backgroundColor: AppColors.background }}
      contentContainerClassName="pt-6 pb-6"
      showsVerticalScrollIndicator={false}>

      <Text
        className={cs('text-[22px] font-bold', 'text-[28px] font-bold')}
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        Czytania z Mszy
      </Text>
      <Text
        className={cs('mt-2 text-[14px] leading-5', 'mt-2 text-[16px] leading-6')}
        style={{
          color: colors.onSurfaceVariant,
          fontFamily: typography.fontFamily,
          fontSize: isCompact ? 14 : 16,
          lineHeight: isCompact ? 20 : 24,
        }}>
        Dzisiejsze czytania mszalne z serwisu Niedziela Niezbędnik.
      </Text>
      <ReadingFontSizeControl
        value={fontScale}
        onChange={setFontScale}
        accentColor={READINGS_ACCENT}
        borderColor={READINGS_ACCENT_BORDER}
      />

      {isLoading || isFetching ? (
        <View className="mt-8">
          <AppLoader label="Pobieranie dzisiejszych czytań..." fontScale={fontScale} minHeight={144} />
        </View>
      ) : isError || !data ? (
        <Text
          className={cs('mt-8 text-[15px] leading-6', 'mt-8 text-[16px] leading-7')}
          style={{
            color: '#9b3d3d',
            fontFamily: typography.fontFamily,
            fontSize: (isCompact ? 15 : 16) * fontScale,
            lineHeight: (isCompact ? 24 : 28) * fontScale,
          }}>
          Nie udało się pobrać dzisiejszych czytań mszalnych.
        </Text>
      ) : (
        <View className="mt-8 gap-4">
          <View
            className="rounded-[24px] border px-5 py-5"
            style={{
              borderColor: READINGS_ACCENT_BORDER,
              borderRadius: 24,
              backgroundColor: READINGS_ACCENT_SOFT,
            }}>
            <Text
              className="text-[13px] font-semibold uppercase tracking-[1px]"
              style={{ color: READINGS_ACCENT, fontFamily: typography.fontFamily }}>
              Dzień liturgiczny
            </Text>
            <Text
              className={cs('mt-1 text-[17px] font-medium', 'mt-1 text-[19px] font-medium')}
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {formatDate(data.date)}
            </Text>
            {data.season ? (
              <Text
                className={cs('mt-2 text-[14px] leading-5', 'mt-2 text-[15px] leading-6')}
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: typography.fontFamily,
                  fontSize: (isCompact ? 14 : 15) * fontScale,
                  lineHeight: (isCompact ? 20 : 24) * fontScale,
                }}>
                Okres: {data.season}
              </Text>
            ) : null}
            {data.celebration ? (
              <Text
                className={cs('mt-2 text-[14px] leading-5', 'mt-2 text-[15px] leading-6')}
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: typography.fontFamily,
                  fontSize: (isCompact ? 14 : 15) * fontScale,
                  lineHeight: (isCompact ? 20 : 24) * fontScale,
                }}>
                {data.celebration}
              </Text>
            ) : null}
          </View>

          {data.readings.map((reading) => (
            <ReadingCard key={reading.id} reading={reading} fontScale={fontScale} />
          ))}

          <Text
            className={cs('px-1 text-[12px] leading-5', 'px-1 text-[13px] leading-5')}
            style={{
              color: colors.onSurfaceVariant,
              fontFamily: typography.fontFamily,
              fontSize: (isCompact ? 12 : 13) * fontScale,
              lineHeight: 20 * fontScale,
            }}>
            Zrodlo: {data.sourceUrl}
          </Text>
        </View>
      )}
    </AppScreenScrollView>
  );
}
