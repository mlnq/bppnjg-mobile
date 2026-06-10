import { useRef, useState, useCallback } from 'react';
import { Animated, PanResponder } from 'react-native';

const SLIDE_WIDTH = 400;
const SWIPE_VELOCITY_THRESHOLD = 500;
const SWIPE_DISTANCE_THRESHOLD = 100;

export function useSlidePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const isOpenRef = useRef(false);

  const open = useCallback(() => {
    setIsOpen(true);
    isOpenRef.current = true;
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const close = useCallback(() => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
      isOpenRef.current = false;
    });
  }, [anim]);

  const panHandlers = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isOpenRef.current,
      onMoveShouldSetPanResponder: (_, { dx }) => isOpenRef.current && dx < -10,
      onPanResponderMove: (_, { dx }) => {
        if (dx < 0) {
          anim.setValue(1 + dx / SLIDE_WIDTH);
        }
      },
      onPanResponderRelease: (_, { dx, vx }) => {
        const shouldClose = vx < -SWIPE_VELOCITY_THRESHOLD || dx < -SWIPE_DISTANCE_THRESHOLD;

        if (shouldClose) {
          close();
        } else {
          Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();
        }
      },
    })
  ).current.panHandlers;

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SLIDE_WIDTH, 0],
  });

  return { isOpen, open, close, panHandlers, translateX };
}
