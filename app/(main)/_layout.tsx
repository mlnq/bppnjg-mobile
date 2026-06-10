import { useEffect } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';

import { AppShell } from '../../features/@app-core/components/AppShell';
import { getPilgrimageStackScreenOptions } from '../../features/@app-core/components/getPilgrimageStackScreenOptions';
import type { AppTab } from '../../features/@app-core/routes/appTabs';
import {
  prefetchPilgrimageHomeData,
  prefetchPilgrimageNotifications,
} from '../../features/@app-core/services/pilgrimageDataRefresh';

const BACK_HIDDEN_ROUTES = new Set<string>(['index', 'route', 'news']);
const SETTINGS_VISIBLE_ROUTES = new Set<string>(['index']);

function getActiveTab(pathname: string): AppTab | undefined {
  if (pathname.startsWith('/prayer')) {
    return 'prayer';
  }

  if (pathname === '/news') {
    return 'info';
  }

  if (pathname === '/route') {
    return 'route';
  }

  if (pathname === '/') {
    return 'home';
  }

  if (pathname === '/settings') {
    return undefined;
  }

  return 'home';
}
export default function MainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveTab(pathname);
  const stackScreenOptions = getPilgrimageStackScreenOptions({
    hideBackRoutes: BACK_HIDDEN_ROUTES,
    showSettingsRoutes: SETTINGS_VISIBLE_ROUTES,
  });

  useEffect(() => {
    prefetchPilgrimageNotifications();
  }, []);

  const resetStackAndOpenTab = (href: '/' | '/route' | '/prayer' | '/news') => {
    if (router.canGoBack()) {
      router.dismissAll();
    }

    router.replace(href);
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={(tab) => {
        const isOnTabRootScreen =
          (tab === 'home' && pathname === '/') ||
          (tab === 'route' && pathname === '/route') ||
          (tab === 'prayer' && pathname === '/prayer') ||
          (tab === 'info' && pathname === '/news');

        if (isOnTabRootScreen) {
          return;
        }

        if (tab === 'home') {
          prefetchPilgrimageHomeData(true);
          resetStackAndOpenTab('/');
          return;
        }

        if (tab === 'route') {
          resetStackAndOpenTab('/route');
          return;
        }

        if (tab === 'prayer') {
          resetStackAndOpenTab('/prayer');
          return;
        }

        if (tab === 'info') {
          prefetchPilgrimageNotifications();
          resetStackAndOpenTab('/news');
          return;
        }
      }}>
      <Stack
        screenOptions={(props) => ({
          ...stackScreenOptions(props),
          animation: 'none',
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
          gestureResponseDistance: {
            start: 1, // 'start' to lewa krawędź na iOS
          },
        })}>
        <Stack.Screen name="index" />
        <Stack.Screen name="route" />
        <Stack.Screen
          name="prayer"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="quartermaster"
          options={{
            animation: 'slide_from_right',
            animationMatchesGesture: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="news"
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="conference"
          options={{
            animation: 'slide_from_right',
            animationMatchesGesture: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerRight: undefined,
            animation: 'slide_from_right',
            animationMatchesGesture: true,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="quartermaster/[commentId]"
          options={{
            animation: 'slide_from_right',
            animationMatchesGesture: true,
            gestureEnabled: true,
          }}
        />
      </Stack>
    </AppShell>
  );
}
