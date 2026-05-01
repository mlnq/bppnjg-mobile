import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { subscribeToAppToast, type AppToastPayload } from '../services/appToast';

const { typography } = pilgrimageRouteTheme;

export function AppToastHost() {
  const [toast, setToast] = useState<AppToastPayload | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return subscribeToAppToast((payload) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      setToast(payload);
      opacity.setValue(0);
      translateY.setValue(-12);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      hideTimeoutRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -12,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => setToast(null));
      }, 3600);
    });
  }, [opacity, translateY]);

  if (!toast) {
    return null;
  }

  const backgroundColor = toast.tone === 'error' ? '#8f2d2d' : '#1f5133';

  return (
    <View pointerEvents="none" className="absolute left-0 right-0 top-0 z-50 items-center px-4 pt-16">
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
          backgroundColor,
          borderRadius: 18,
          paddingHorizontal: 16,
          paddingVertical: 12,
          width: '100%',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 10,
        }}>
        <Text
          style={{
            color: '#ffffff',
            fontFamily: typography.fontFamily,
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '600',
          }}>
          {toast.message}
        </Text>
      </Animated.View>
    </View>
  );
}
