import { useState } from 'react';
import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { useCompactStyles } from '../../../hooks/useCompactStyles';
import {
  READING_FONT_SCALE_STEPS,
  ReadingFontSizeControl,
  type ReadingFontScale,
} from '../../../components/ReadingFontSizeControl';
import { AppLoader } from '../../../components/AppLoader';
import { formatDate } from '../../../utils/formatters/formatDate';
import {
  type BreviaryOfficeId,
  useGetBreviaryOfficeQuery,
} from '../../../services/brewiarzApi';
import { BreviarySectionCard } from '../components/BreviarySectionCard';
import { DEFAULT_BREVIARY_OFFICE } from '../helpers/pilgrimageBreviary.helpers';
import { OfficeTabs } from '../components/OfficeTabs';

const { colors, typography } = pilgrimageRouteTheme;
const BREVIARY_ACCENT = '#2563EB';
const BREVIARY_ACCENT_SOFT = '#EFF6FF';
const BREVIARY_ACCENT_BORDER = '#BFDBFE';

export function PilgrimageBreviaryScreen() {
  const { cs, isCompact } = useCompactStyles();
  const [activeOffice, setActiveOffice] = useState<BreviaryOfficeId>(DEFAULT_BREVIARY_OFFICE);
  const [fontScale, setFontScale] = useState<ReadingFontScale>(READING_FONT_SCALE_STEPS[0]);
  const { data, isLoading, isFetching, isError } = useGetBreviaryOfficeQuery(activeOffice);

  return (
    <AppScreenScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
    

      <Text
        className={cs('text-[22px] font-bold', 'text-[28px] font-bold')}
        style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
        Brewiarz
      </Text>
      <Text
        className={cs('mt-2 text-[14px] leading-5', 'mt-2 text-[16px] leading-6')}
        style={{
          color: colors.onSurfaceVariant,
          fontFamily: typography.fontFamily,
          fontSize: isCompact ? 14 : 16,
          lineHeight: isCompact ? 20 : 24,
        }}>
        Dzisiejsza Liturgia Godzin z serwisu brewiarz.pl.
      </Text>

      <OfficeTabs value={activeOffice} onChange={setActiveOffice} />
      <ReadingFontSizeControl
        value={fontScale}
        onChange={setFontScale}
        accentColor={BREVIARY_ACCENT}
        borderColor={BREVIARY_ACCENT_BORDER}
      />

      {isLoading || isFetching ? (
        <View className="mt-8">
          <AppLoader label="Pobieranie tekstow brewiarza..." fontScale={fontScale} minHeight={144} />
        </View>
      ) : isError || !data || data.sections.length === 0 ? (
        <Text
          className={cs('mt-8 text-[15px] leading-6', 'mt-8 text-[16px] leading-7')}
          style={{
            color: '#9b3d3d',
            fontFamily: typography.fontFamily,
            fontSize: (isCompact ? 15 : 16) * fontScale,
            lineHeight: (isCompact ? 24 : 28) * fontScale,
          }}>
          Nie udalo sie pobrac tekstu wybranej godziny brewiarza.
        </Text>
      ) : (
        <View className="mt-8 gap-4">
          <View
            className="rounded-[24px] border px-5 py-5"
            style={{
              borderColor: BREVIARY_ACCENT_BORDER,
              borderRadius: 24,
              backgroundColor: BREVIARY_ACCENT_SOFT,
            }}>
            <Text
              className="text-[13px] font-semibold uppercase tracking-[1px]"
              style={{ color: BREVIARY_ACCENT, fontFamily: typography.fontFamily }}>
              Dzisiejsze oficjum
            </Text>
            <Text
              className={cs('mt-1 text-[19px] font-medium', 'mt-1 text-[21px] font-medium')}
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {data.officeLabel}
            </Text>
            <Text
              className={cs('mt-2 text-[14px] leading-5', 'mt-2 text-[15px] leading-6')}
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: typography.fontFamily,
                fontSize: (isCompact ? 14 : 15) * fontScale,
                lineHeight: (isCompact ? 20 : 24) * fontScale,
              }}>
              {formatDate(data.date)}
            </Text>
            {data.psalterWeek ? (
              <Text
                className={cs('mt-2 text-[14px] leading-5', 'mt-2 text-[15px] leading-6')}
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: typography.fontFamily,
                  fontSize: (isCompact ? 14 : 15) * fontScale,
                  lineHeight: (isCompact ? 20 : 24) * fontScale,
                }}>
                {data.psalterWeek}
              </Text>
            ) : null}
            {data.season ? (
              <Text
                className={cs('mt-1 text-[14px] leading-5', 'mt-1 text-[15px] leading-6')}
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: typography.fontFamily,
                  fontSize: (isCompact ? 14 : 15) * fontScale,
                  lineHeight: (isCompact ? 20 : 24) * fontScale,
                }}>
                {data.season}
              </Text>
            ) : null}
            {data.liturgicalDay ? (
              <Text
                className={cs('mt-1 text-[14px] leading-5', 'mt-1 text-[15px] leading-6')}
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: typography.fontFamily,
                  fontSize: (isCompact ? 14 : 15) * fontScale,
                  lineHeight: (isCompact ? 20 : 24) * fontScale,
                }}>
                {data.liturgicalDay}
              </Text>
            ) : null}
          </View>

          {data.sections.map((section) => (
            <BreviarySectionCard
              key={`${data.office}-${section.id}`}
              {...section}
              fontScale={fontScale}
            />
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
