import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import {
  ReadingFontSizeControl,
  type ReadingFontScale,
} from '../../../components/ReadingFontSizeControl';
import { AppLoader } from '../../../components/AppLoader';
import { useGetDailyReadingsQuery } from '../../../services/niedzielaApi';
import { ReadingCard } from '../components/ReadingCard';

const { colors, typography } = pilgrimageRouteTheme;
const READINGS_ACCENT = '#D97706';
const READINGS_ACCENT_SOFT = '#FFF7E6';
const READINGS_ACCENT_BORDER = '#FCD34D';

type PilgrimageMassReadingsScreenProps = {
  onBack: () => void;
};

export function PilgrimageMassReadingsScreen({ onBack }: PilgrimageMassReadingsScreenProps) {
  const { data, isLoading, isFetching, isError } = useGetDailyReadingsQuery();
  const [fontScale, setFontScale] = useState<ReadingFontScale>(1);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="px-4 pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
      <TouchableOpacity activeOpacity={0.75} onPress={onBack}>
        <Text
          className="mb-5 text-[15px] font-semibold"
          style={{ color: READINGS_ACCENT, fontFamily: typography.fontFamily }}>
          Wróć do niezbędnika
        </Text>
      </TouchableOpacity>

      <Text
        className="text-[28px] font-bold"
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        Czytania z Mszy
      </Text>
      <Text
        className="mt-2 text-[16px] leading-6"
        style={{
          color: colors.onSurfaceVariant,
          fontFamily: typography.fontFamily,
          fontSize: 16,
          lineHeight: 24,
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
          className="mt-8 text-[16px] leading-7"
          style={{
            color: '#9b3d3d',
            fontFamily: typography.fontFamily,
            fontSize: 16 * fontScale,
            lineHeight: 28 * fontScale,
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
              className="mt-1 text-[19px] font-medium"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {data.date}
            </Text>
            {data.season ? (
              <Text
                className="mt-2 text-[15px] leading-6"
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: typography.fontFamily,
                  fontSize: 15 * fontScale,
                  lineHeight: 24 * fontScale,
                }}>
                Okres: {data.season}
              </Text>
            ) : null}
            {data.celebration ? (
              <Text
                className="mt-2 text-[15px] leading-6"
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: typography.fontFamily,
                  fontSize: 15 * fontScale,
                  lineHeight: 24 * fontScale,
                }}>
                {data.celebration}
              </Text>
            ) : null}
          </View>

          {data.readings.map((reading) => (
            <ReadingCard key={reading.id} reading={reading} fontScale={fontScale} />
          ))}

          <Text
            className="px-1 text-[13px] leading-5"
            style={{
              color: colors.onSurfaceVariant,
              fontFamily: typography.fontFamily,
              fontSize: 13 * fontScale,
              lineHeight: 20 * fontScale,
            }}>
            Zrodlo: {data.sourceUrl}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
