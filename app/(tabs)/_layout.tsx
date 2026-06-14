import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { SettingsButton } from '../../features/@app-core/components/SettingsButton';
import { PilgrimageBottomNav } from '../../features/@app-core/components/pilgrimage/BottomNav';
import { sharedHeaderStyles } from '../../features/@app-core/components/pilgrimage/getStackScreenOptions';
import type { AppTab } from '../../features/@app-core/routes/appTabs';
import {
  prefetchPilgrimageHomeData,
  prefetchPilgrimageNotifications,
} from '../../features/@app-core/services/pilgrimageDataRefresh';

const ROUTE_TO_TAB: Record<string, AppTab> = {
  index: 'home',
  route: 'route',
  prayer: 'prayer',
  news: 'info',
};

const TAB_TO_ROUTE: Record<AppTab, string> = {
  home: 'index',
  route: 'route',
  prayer: 'prayer',
  info: 'news',
};

function TabBarAdapter({ state, navigation }: BottomTabBarProps) {
  const activeRouteName = state.routes[state.index]?.name ?? 'index';
  const activeTab = ROUTE_TO_TAB[activeRouteName];

  return (
    <PilgrimageBottomNav
      activeTab={activeTab}
      onTabChange={(tab) => {
        if (tab === 'home') prefetchPilgrimageHomeData(true);
        if (tab === 'info') prefetchPilgrimageNotifications();
        navigation.navigate(TAB_TO_ROUTE[tab]);
      }}
    />
  );
}

export default function TabsLayout() {
  useEffect(() => {
    prefetchPilgrimageNotifications();
  }, []);

  return (
    <Tabs
      tabBar={(props) => <TabBarAdapter {...props} />}
      screenOptions={{
        ...(sharedHeaderStyles as BottomTabNavigationOptions),
        headerRight: () => <SettingsButton />,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Start' }} />
      <Tabs.Screen name="route" options={{ title: 'Trasa' }} />
      <Tabs.Screen name="news" options={{ title: 'Info' }} />
      <Tabs.Screen
        name="prayer"
        options={{ title: 'Niezbędnik', headerShown: false }}
      />
    </Tabs>
  );
}
