import { ReactNode } from 'react';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SlideOverPanelProps = {
  translateX: Animated.AnimatedInterpolation<number>;
  panHandlers: object;
  backgroundColor: string;
  children: ReactNode;
};

export function SlideOverPanel({
  translateX,
  panHandlers,
  backgroundColor,
  children,
}: SlideOverPanelProps) {
  return (
    <Animated.View
      className="absolute inset-0"
      style={{ transform: [{ translateX }], backgroundColor, zIndex: 10 }}
      {...panHandlers}>
      <SafeAreaView className="flex-1" style={{ backgroundColor }} edges={['top']}>
        {children}
      </SafeAreaView>
    </Animated.View>
  );
}
