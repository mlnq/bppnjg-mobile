import { ActivityIndicator, Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';

const { colors, typography } = pilgrimageRouteTheme;

type AppLoaderProps = {
  label?: string;
  fontScale?: number;
  minHeight?: number;
  compact?: boolean;
};

export function AppLoader({
  label = 'Ładowanie...',
  fontScale = 1,
  minHeight,
  compact = false,
}: AppLoaderProps) {
  const spinnerSize = compact ? 'small' : 'large';
  const textFontSize = (compact ? 15 : 16) * fontScale;
  const textLineHeight = (compact ? 22 : 28) * fontScale;

  return (
    <View
      className={`items-center justify-center ${compact ? 'gap-3' : 'gap-4'}`}
      style={{ minHeight }}>
      <ActivityIndicator color={colors.primary} size={spinnerSize} />
      <Text
        className="text-center"
        style={{
          color: colors.onSurfaceVariant,
          fontFamily: typography.fontFamily,
          fontSize: textFontSize,
          lineHeight: textLineHeight,
        }}>
        {label}
      </Text>
    </View>
  );
}
