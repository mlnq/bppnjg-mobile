import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { PilgrimageBottomNav } from './PilgrimageBottomNav';
import type { AppTab } from '../routes/appTabs';

const { colors } = pilgrimageRouteTheme;

type AppShellProps = {
  activeTab?: AppTab;
  children: ReactNode;
  onTabChange: (tab: AppTab) => void;
  showBottomNav?: boolean;
};

export function AppShell({
  activeTab,
  children,
  onTabChange,
  showBottomNav = true,
}: AppShellProps) {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.surface }} edges={['bottom']}>
      <View className="flex-1">{children}</View>
      {showBottomNav ? <PilgrimageBottomNav activeTab={activeTab} onTabChange={onTabChange} /> : null}
    </SafeAreaView>
  );
}
