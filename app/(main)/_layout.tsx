import { useEffect } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';

import { AppLayout } from '../../features/@app-core/components/AppLayout';
import type { AppTab } from '../../features/@app-core/routes/appTabs';
import { notificationsApi } from '../../features/@app-core/services/notificationsApi';
import { pilgrimageApi } from '../../features/@app-core/services/pilgrimageApi';
import { quartermasterApi } from '../../features/@app-core/services/quartermasterApi';
import { store } from '../../features/@app-core/store/store';

function getActiveTab(pathname: string): AppTab {
  if (pathname.startsWith('/prayer')) {
    return 'prayer';
  }

  if (pathname === '/route') {
    return 'route';
  }

  return 'home';
}

export default function MainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveTab(pathname);

  useEffect(() => {
    store.dispatch(
      notificationsApi.util.prefetch('getPilgrimageNotifications', undefined, {
        force: false,
      })
    );
  }, []);

  const refreshHomeTabData = () => {
    store.dispatch(
      pilgrimageApi.util.prefetch('getPilgrimageBootstrap', undefined, {
        force: true,
      })
    );
    store.dispatch(
      notificationsApi.util.prefetch('getPilgrimageNotifications', undefined, {
        force: true,
      })
    );
    store.dispatch(
      quartermasterApi.util.prefetch('getQuartermasterComments', undefined, {
        force: true,
      })
    );
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={(tab) => {
        if (tab === 'home') {
          refreshHomeTabData();
          router.replace('/');
          return;
        }

        if (tab === 'route') {
          router.replace('/route');
          return;
        }

        if (tab === 'prayer') {
          router.replace('/prayer');
          return;
        }

        router.replace('/news');
      }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="route" />
        <Stack.Screen name="prayer" />
        <Stack.Screen
          name="news"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_right',
            animationMatchesGesture: true,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="conference"
          options={{
            animation: 'slide_from_right',
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="quartermaster/[commentId]"
          options={{
            animation: 'slide_from_right',
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        />
      </Stack>
    </AppLayout>
  );
}
