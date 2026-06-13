import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { SettingsIcon, pilgrimageRouteTheme } from '../../../packages/@app-ui';

const { colors } = pilgrimageRouteTheme;

export function SettingsButton() {
  return (
    <Pressable
      accessibilityLabel="Ustawienia"
      accessibilityRole="button"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 4 }}
      onPress={() => router.push('/settings')}
      style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}>
      <SettingsIcon size={22} color={colors.onSurface} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 4,
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
