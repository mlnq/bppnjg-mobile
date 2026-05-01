import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { ReadingFontScale } from '../../../components/ReadingFontSizeControl';
import type { BreviarySectionVariant } from '../../../services/brewiarzApi';
import { bodyToMarkdown } from '../helpers/pilgrimageBreviary.helpers';

const { colors, typography } = pilgrimageRouteTheme;
const BREVIARY_ACCENT = '#2563EB';
const BREVIARY_ACCENT_SOFT = '#EFF6FF';
const BREVIARY_ACCENT_BORDER = '#BFDBFE';

type BreviarySectionCardProps = {
  title: string;
  body: string;
  fontScale: ReadingFontScale;
  variants?: BreviarySectionVariant[];
};

export function BreviarySectionCard({
  title,
  body,
  fontScale,
  variants,
}: BreviarySectionCardProps) {
  const [activeVariantId, setActiveVariantId] = useState(variants?.[0]?.id);
  const activeBody = variants?.find((variant) => variant.id === activeVariantId)?.body ?? body;
  const markdownBody = bodyToMarkdown(activeBody);

  return (
    <View
      className="rounded-[24px] border bg-white px-5 py-5"
      style={{ borderColor: BREVIARY_ACCENT_BORDER, borderRadius: 24 }}>
      <Text
        className="text-[13px] font-semibold uppercase tracking-[1px]"
        style={{ color: BREVIARY_ACCENT, fontFamily: typography.fontFamily }}>
        {title}
      </Text>
      {variants?.length ? (
        <View className="mt-4 flex-row flex-wrap gap-2">
          {variants.map((variant) => {
            const isActive = variant.id === activeVariantId;

            return (
              <TouchableOpacity
                key={variant.id}
                activeOpacity={0.8}
                onPress={() => setActiveVariantId(variant.id)}
                className="rounded-[8px] border px-3 py-2"
                style={{
                  borderColor: isActive ? BREVIARY_ACCENT : BREVIARY_ACCENT_BORDER,
                  backgroundColor: isActive ? BREVIARY_ACCENT_SOFT : colors.surfaceContainerLowest,
                }}>
                <Text
                  className="text-[14px] font-semibold"
                  style={{
                    color: BREVIARY_ACCENT,
                    fontFamily: typography.fontFamily,
                  }}>
                  {variant.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
      <Markdown
        mergeStyle={false}
        style={{
          body: {
            marginTop: variants?.length ? 12 : 16,
            color: colors.onSurface,
            fontFamily: typography.fontFamily,
            fontSize: 16 * fontScale,
            lineHeight: 30 * fontScale,
          },
          paragraph: {
            marginTop: 0,
            marginBottom: 0,
            color: colors.onSurface,
            fontFamily: typography.fontFamily,
            fontSize: 16 * fontScale,
            lineHeight: 30 * fontScale,
          },
          text: {
            color: colors.onSurface,
            fontFamily: typography.fontFamily,
            fontSize: 16 * fontScale,
            lineHeight: 30 * fontScale,
          },
          strong: {
            color: BREVIARY_ACCENT,
            fontFamily: typography.fontFamily,
            fontSize: 16 * fontScale,
            lineHeight: 30 * fontScale,
            fontWeight: '700',
          },
        }}>
        {markdownBody}
      </Markdown>
    </View>
  );
}
