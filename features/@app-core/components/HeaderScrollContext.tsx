import { createContext, useContext, useMemo, useRef, type ReactNode } from 'react';
import { Animated } from 'react-native';

export const APP_HEADER_HEIGHT = 72;

type HeaderScrollContextValue = {
  scrollY: Animated.Value;
  headerTranslateY: Animated.AnimatedInterpolation<number>;
};

const HeaderScrollContext = createContext<HeaderScrollContextValue | null>(null);

export function HeaderScrollProvider({ children }: { children: ReactNode }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const clampedScrollY = useRef(Animated.diffClamp(scrollY, 0, APP_HEADER_HEIGHT)).current;

  const headerTranslateY = useMemo(
    () =>
      clampedScrollY.interpolate({
        inputRange: [0, APP_HEADER_HEIGHT],
        outputRange: [0, -APP_HEADER_HEIGHT],
        extrapolate: 'clamp',
      }),
    [clampedScrollY]
  );

  return (
    <HeaderScrollContext.Provider value={{ scrollY, headerTranslateY }}>
      {children}
    </HeaderScrollContext.Provider>
  );
}

export function useHeaderScroll() {
  const context = useContext(HeaderScrollContext);
  if (!context) {
    throw new Error('useHeaderScroll must be used within HeaderScrollProvider');
  }
  return context;
}
