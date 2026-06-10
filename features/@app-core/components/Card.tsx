import type { ReactNode } from 'react';
import { TouchableOpacity, View, type StyleProp, type ViewStyle } from 'react-native';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';

const { colors } = pilgrimageRouteTheme;

type CardProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
};

type CardButtonProps = CardProps & {
  onPress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
};

const cardBaseStyle: ViewStyle = {
  shadowColor: colors.onSurface,
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export function Card({
  children,
  className,
  style,
  backgroundColor = colors.surfaceContainerLowest,
  borderColor = colors.outlineVariant,
  borderWidth = 1,
}: CardProps) {
  return (
    <View
      className={className}
      style={[cardBaseStyle, { backgroundColor, borderColor, borderWidth }, style]}>
      {children}
    </View>
  );
}

export function CardButton({
  children,
  className,
  style,
  backgroundColor = colors.surfaceContainerLowest,
  borderColor = colors.outlineVariant,
  borderWidth = 1,
  activeOpacity = 0.9,
  disabled = false,
  onPress,
}: CardButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={onPress}
      className={className}
      style={[cardBaseStyle, { backgroundColor, borderColor, borderWidth }, style]}>
      {children}
    </TouchableOpacity>
  );
}
