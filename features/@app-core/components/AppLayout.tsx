import { ReactNode, useRef, useState } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { PilgrimageBottomNav } from './PilgrimageBottomNav';
import { PilgrimageRouteHeader } from './PilgrimageRouteHeader';
import { type AppTab } from '../routes/appTabs';
import { PilgrimageNewsScreen } from '../features/news/screens/PilgrimageNewsScreen';

const { colors } = pilgrimageRouteTheme;

type AppLayoutProps = {
  activeTab?: AppTab;
  children: ReactNode;
  onTabChange: (tab: AppTab) => void;
  showHeader?: boolean;
  showBottomNav?: boolean;
};

export function AppLayout({
  activeTab,
  children,
  onTabChange,
  showHeader = true,
  showBottomNav = true,
}: AppLayoutProps) {
  const insets = useSafeAreaInsets();
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const openNews = () => {
    setIsNewsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeNews = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsNewsOpen(false));
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0], // slide from right
  });

  const panResponderRef = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isNewsOpen,
      onMoveShouldSetPanResponder: () => isNewsOpen,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(Math.min(0, gestureState.dx / 400));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.velocityX < -500 || gestureState.dx < -100) {
          closeNews();
        } else {
          Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.surface }} edges={['top']}>
      {showHeader ? <PilgrimageRouteHeader activeTab={activeTab ?? 'home'} onOpenNews={openNews} /> : null}
      <View
        className="flex-1"
        style={{ paddingBottom: showBottomNav ? 82 + Math.max(insets.bottom, 12) : 0 }}>
        {children}
      </View>
      {showBottomNav ? <PilgrimageBottomNav activeTab={activeTab} onTabChange={onTabChange} /> : null}
      {isNewsOpen && (
        <Animated.View
          className="absolute inset-0"
          style={{
            transform: [{ translateX }],
            backgroundColor: colors.surface,
            zIndex: 10,
          }}
          {...panResponderRef.panHandlers}>
          <SafeAreaView className="flex-1" style={{ backgroundColor: colors.surface }} edges={['top']}>
            <PilgrimageNewsScreen onClose={closeNews} />
          </SafeAreaView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
