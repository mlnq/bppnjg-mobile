import { Text, TouchableOpacity, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { getReadingFontSizeLabel } from './ReadingFontSizeControl.helpers';

const { colors, radii, typography } = pilgrimageRouteTheme;

export const READING_FONT_SCALE_STEPS = [1, 1.15, 1.3] as const;

export type ReadingFontScale = (typeof READING_FONT_SCALE_STEPS)[number];

export type ReadingFontSizeControlProps = {
  value: ReadingFontScale;
  onChange: (value: ReadingFontScale) => void;
  accentColor?: string;
  borderColor?: string;
};

export function ReadingFontSizeControl({
  value,
  onChange,
  accentColor = colors.primary,
  borderColor = '#E5E7EB',
}: ReadingFontSizeControlProps) {
  return (
    <View
      className="mt-5 flex-row items-center self-start gap-2"
      style={{
        borderRadius: radii.full,
      }}>
      {READING_FONT_SCALE_STEPS.map((scale) => {
        const isActive = scale === value;

        return (
          <TouchableOpacity
            key={scale}
            activeOpacity={0.8}
            onPress={() => onChange(scale)}
            className="rounded-full border px-4 py-2"
            style={{
              borderColor: isActive ? accentColor : borderColor,
              backgroundColor: isActive ? accentColor : colors.surfaceContainerLowest,
            }}>
            <Text
              className="font-semibold"
              style={{
                color: isActive ? '#FFFFFF' : colors.onSurfaceVariant,
                fontFamily: typography.fontFamily,
                fontSize: scale === 1 ? 14 : scale === 1.15 ? 16 : 18,
              }}>
              {getReadingFontSizeLabel(scale)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
