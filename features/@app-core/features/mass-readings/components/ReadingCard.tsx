import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { ReadingFontScale } from '../../../components/ReadingFontSizeControl';
import type { NiedzielaReading } from '../../../services/niedzielaApi';

const { colors, typography } = pilgrimageRouteTheme;
const READINGS_ACCENT = '#D97706';
const READINGS_ACCENT_SOFT = '#FFF7E6';
const READINGS_ACCENT_BORDER = '#FCD34D';

type ReadingCardProps = {
  reading: NiedzielaReading;
  fontScale: ReadingFontScale;
};

export function ReadingCard({ reading, fontScale }: ReadingCardProps) {
  return (
    <View
      className="rounded-[24px] border bg-white px-5 py-5"
      style={{ borderColor: READINGS_ACCENT_BORDER, borderRadius: 24 }}>
      <Text
        className="text-[13px] font-semibold uppercase tracking-[1px]"
        style={{ color: READINGS_ACCENT, fontFamily: typography.fontFamily }}>
        {reading.label}
      </Text>
      <Text
        className="mt-1 text-[19px] font-medium"
        style={{
          color: colors.onSurface,
          fontFamily: typography.fontFamily,
          fontSize: 19 * fontScale,
          lineHeight: 24 * fontScale,
        }}>
        {reading.reference || 'Brak referencji'}
      </Text>
      <Text
        className="mt-2 text-[16px] italic leading-6"
        style={{
          color: colors.onSurfaceVariant,
          fontFamily: typography.fontFamily,
          fontSize: 16 * fontScale,
          lineHeight: 24 * fontScale,
        }}>
        {reading.title}
      </Text>
      {reading.introduction ? (
        <View
          className="mt-4 rounded-[18px] border px-4 py-3"
          style={{ backgroundColor: READINGS_ACCENT_SOFT, borderColor: READINGS_ACCENT_BORDER }}>
          <Text
            className="text-[15px] font-semibold leading-6"
            style={{
              color: READINGS_ACCENT,
              fontFamily: typography.fontFamily,
              fontSize: 15 * fontScale,
              lineHeight: 24 * fontScale,
            }}>
            {reading.introduction}
          </Text>
        </View>
      ) : null}
      <Text
        className="mt-4 text-[16px] leading-8"
        style={{
          color: colors.onSurface,
          fontFamily: typography.fontFamily,
          fontSize: 16 * fontScale,
          lineHeight: 32 * fontScale,
        }}>
        {reading.body}
      </Text>
    </View>
  );
}
