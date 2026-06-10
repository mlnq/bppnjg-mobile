import { Pressable, StyleSheet } from 'react-native';

import { BackIcon, pilgrimageRouteTheme } from '../../../packages/@app-ui';

const { colors } = pilgrimageRouteTheme;

export function HeaderBackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel="Wróć"
      accessibilityRole="button"
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}>
      <BackIcon size={20} color={colors.onSurface} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 4,
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
