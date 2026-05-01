import { forwardRef } from 'react';
import { Animated, Platform, ScrollView, type ScrollViewProps } from 'react-native';

import { useHeaderScroll } from './HeaderScrollContext';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const AppScrollView = forwardRef<ScrollView, ScrollViewProps>((props, ref) => {
  const { scrollY } = useHeaderScroll();

  return (
    <AnimatedScrollView
      ref={ref}
      {...props}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
          useNativeDriver: Platform.OS !== 'web',
          listener: props.onScroll,
        }
      )}
    />
  );
});

AppScrollView.displayName = 'AppScrollView';
