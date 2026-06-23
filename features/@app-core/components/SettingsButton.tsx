import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsIcon, pilgrimageRouteTheme } from '../../../packages/@app-ui';

const { colors } = pilgrimageRouteTheme;

export function SettingsButton() {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityLabel="Ustawienia"
      accessibilityRole="button"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      onPress={() => router.push('/settings')}
      style={({ pressed }) => [
        styles.button,
        { marginRight: Math.max(insets.right, 12) },
        pressed ? styles.buttonPressed : null,
      ]}>
      <SettingsIcon size={22} color={colors.onSurface} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
