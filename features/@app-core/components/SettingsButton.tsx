import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { SettingsIcon, pilgrimageRouteTheme } from '../../../packages/@app-ui';

const { colors } = pilgrimageRouteTheme;

export function SettingsButton() {
  const insets = useSafeAreaInsets();
  const rightMargin = Math.max(insets.right + 12, 24);

  return (
    <Pressable
      accessibilityLabel="Ustawienia"
      accessibilityRole="button"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      onPress={() => router.push('/settings')}
      style={({ pressed }) => [
        styles.button,
        { marginRight: rightMargin },
        pressed ? styles.buttonPressed : null,
      ]}>
      <SettingsIcon size={22} color={colors.onSurface} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 12,
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
