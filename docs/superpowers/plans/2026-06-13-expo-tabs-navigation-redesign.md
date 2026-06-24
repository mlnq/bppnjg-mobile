# Expo Tabs Navigation Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the simulated-tab Stack navigator with Expo Router's canonical `<Tabs>` pattern, eliminating header jumping on tab switches and making the settings gear always visible.

**Architecture:** A new `app/(tabs)/_layout.tsx` uses `<Tabs tabBar={TabBarAdapter}>` for the four main screens. Pushed screens (settings, conference, quartermaster) are declared in the root `app/_layout.tsx` Stack with explicit options. The `(main)/` group is deleted entirely.

**Tech Stack:** Expo Router v3+, React Navigation (BottomTabBarProps), React Native, TypeScript, NativeWind

**Spec:** `docs/superpowers/specs/2026-06-13-expo-tabs-navigation-redesign.md`

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `app/_layout.tsx` | Add explicit Stack.Screen entries for pushed screens |
| Create | `app/(tabs)/_layout.tsx` | Tabs navigator + TabBarAdapter + header config |
| Move | `app/(main)/index.tsx` → `app/(tabs)/index.tsx` | Home tab screen |
| Move | `app/(main)/route.tsx` → `app/(tabs)/route.tsx` | Route tab screen |
| Move | `app/(main)/news.tsx` → `app/(tabs)/news.tsx` | Info tab screen |
| Move | `app/(main)/prayer/` → `app/(tabs)/prayer/` | Prayer tab group |
| Move | `app/(main)/settings.tsx` → `app/settings.tsx` | Settings pushed screen |
| Move | `app/(main)/conference.tsx` → `app/conference.tsx` | Conference pushed screen |
| Move | `app/(main)/quartermaster.tsx` → `app/quartermaster/index.tsx` | Quartermaster pushed screen |
| Delete | `app/(main)/_layout.tsx` | Replaced |
| Delete | `features/@app-core/components/AppShell.tsx` | Replaced by Tabs |
| Modify | `features/@app-core/components/SettingsButton.tsx` | Fix push path `/(main)/settings` → `/settings` |
| Modify | `features/@app-core/components/pilgrimage/BottomNav.tsx` | Remove absolute positioning |
| Modify | `features/@app-core/components/pilgrimage/getStackScreenOptions.tsx` | Remove `showSettingsRoutes` param, simplify |

---

## Task 1: Fix SettingsButton navigation path

The `SettingsButton` currently pushes to `/(main)/settings`. After the restructure settings lives at `/settings`.

**Files:**
- Modify: `features/@app-core/components/SettingsButton.tsx`

- [ ] **Step 1: Update push path**

Open `features/@app-core/components/SettingsButton.tsx`. Change line 14:

```tsx
onPress={() => router.push('/settings')}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors (route `/settings` will exist after Task 5; this step just prepares the file).

- [ ] **Step 3: Commit**

```bash
git add features/@app-core/components/SettingsButton.tsx
git commit -m "fix: update SettingsButton navigation path to /settings"
```

---

## Task 2: Remove absolute positioning from BottomNav

The `<Tabs>` navigator renders the tabBar in its own layout slot below content. Absolute positioning causes it to float on top and break layout.

**Files:**
- Modify: `features/@app-core/components/pilgrimage/BottomNav.tsx`

- [ ] **Step 1: Remove absolute positioning classes**

In `features/@app-core/components/pilgrimage/BottomNav.tsx`, change the outer `<View>` className from:

```tsx
className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around rounded-t-[22px] border-t px-[10px] pt-2"
```

to:

```tsx
className="flex-row items-center justify-around rounded-t-[22px] border-t px-[10px] pt-2"
```

- [ ] **Step 2: Commit**

```bash
git add features/@app-core/components/pilgrimage/BottomNav.tsx
git commit -m "fix: remove absolute positioning from BottomNav — Tabs manages layout slot"
```

---

## Task 3: Simplify getStackScreenOptions

Remove the `showSettingsRoutes` parameter — it's no longer needed because the Tabs layout puts the settings button in `screenOptions.headerRight` globally. Extract shared header style constants for reuse.

**Files:**
- Modify: `features/@app-core/components/pilgrimage/getStackScreenOptions.tsx`

- [ ] **Step 1: Rewrite the file**

Replace the entire contents of `features/@app-core/components/pilgrimage/getStackScreenOptions.tsx` with:

```tsx
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { pilgrimageRouteTheme } from 'packages/@app-ui';
import { HeaderBackButton } from '../HeaderBackButton';

const { colors, typography } = pilgrimageRouteTheme;

export const sharedHeaderStyles: NativeStackNavigationOptions = {
  headerBackVisible: false,
  headerShadowVisible: false,
  headerTransparent: false,
  headerStyle: {
    backgroundColor: '#fcfaf7',
  },
  headerTitleStyle: {
    color: colors.onSurface,
    fontFamily: typography.fontFamily,
    fontSize: 24,
    fontWeight: '700',
  },
  headerTintColor: colors.onSurface,
  headerTitleAlign: 'center',
};

type PilgrimageStackScreenOptionsConfig = {
  hideBackRoutes?: ReadonlySet<string>;
};

export function getPilgrimageStackScreenOptions({
  hideBackRoutes = new Set<string>(),
}: PilgrimageStackScreenOptionsConfig = {}) {
  return ({
    route,
    navigation,
  }: {
    route: { name: string };
    navigation: { canGoBack: () => boolean; goBack: () => void };
  }): NativeStackNavigationOptions => {
    const showBackButton = !hideBackRoutes.has(route.name) && navigation.canGoBack();
    const headerLeft = showBackButton
      ? () => <HeaderBackButton onPress={() => navigation.goBack()} />
      : undefined;

    return {
      ...sharedHeaderStyles,
      headerLeft,
    };
  };
}
```

- [ ] **Step 2: Check for remaining usages of the old `showSettingsRoutes` param**

```bash
grep -r "showSettingsRoutes" /Users/mlenqe/Praca/private_projects/bppnjg-mobile --include="*.tsx" --include="*.ts"
```

Expected: no results. If any found, remove the `showSettingsRoutes` key from those call sites.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add features/@app-core/components/pilgrimage/getStackScreenOptions.tsx
git commit -m "refactor: simplify getStackScreenOptions, extract sharedHeaderStyles, remove showSettingsRoutes"
```

---

## Task 4: Create app/(tabs)/_layout.tsx

This is the core of the migration. Creates the Tabs navigator with the custom tab bar adapter and settings button in every tab header.

**Files:**
- Create: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: Create the file**

Create `app/(tabs)/_layout.tsx` with the following content:

```tsx
import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { pilgrimageRouteTheme } from '../../packages/@app-ui';
import { SettingsButton } from '../../features/@app-core/components/SettingsButton';
import { PilgrimageBottomNav } from '../../features/@app-core/components/pilgrimage/BottomNav';
import { sharedHeaderStyles } from '../../features/@app-core/components/pilgrimage/getStackScreenOptions';
import type { AppTab } from '../../features/@app-core/routes/appTabs';
import {
  prefetchPilgrimageHomeData,
  prefetchPilgrimageNotifications,
} from '../../features/@app-core/services/pilgrimageDataRefresh';

const { colors, typography } = pilgrimageRouteTheme;

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
        ...sharedHeaderStyles,
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors (some route-not-found errors may appear until files are moved in later tasks — that's OK at this stage).

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/_layout.tsx
git commit -m "feat: add (tabs) layout with Tabs navigator and TabBarAdapter"
```

---

## Task 5: Move tab screen files into (tabs)/

Move all four tab screens and the entire prayer group from `app/(main)/` to `app/(tabs)/`. URLs are unchanged because both `(main)` and `(tabs)` are transparent route groups.

**Files:**
- Move: `app/(main)/index.tsx` → `app/(tabs)/index.tsx`
- Move: `app/(main)/route.tsx` → `app/(tabs)/route.tsx`
- Move: `app/(main)/news.tsx` → `app/(tabs)/news.tsx`
- Move: `app/(main)/prayer/` → `app/(tabs)/prayer/`

- [ ] **Step 1: Move the tab root screens**

```bash
mv /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/index.tsx \
   /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(tabs\)/index.tsx

mv /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/route.tsx \
   /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(tabs\)/route.tsx

mv /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/news.tsx \
   /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(tabs\)/news.tsx
```

- [ ] **Step 2: Move the entire prayer group**

```bash
mv /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/prayer \
   /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(tabs\)/prayer
```

- [ ] **Step 3: Fix import paths inside moved prayer files**

The prayer files used paths relative to `app/(main)/prayer/`. After moving to `app/(tabs)/prayer/` the depth is the same, so relative imports inside those files remain valid. Verify with:

```bash
grep -r "from '\.\." /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(tabs\)/prayer --include="*.tsx"
```

Check that each `../../` path resolves correctly from the new location. The paths point to `features/` which is at repo root — same depth from `(tabs)/prayer/` as from `(main)/prayer/`. No changes needed.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors for the moved files. Errors may still exist for `(main)/` references until Task 6.

- [ ] **Step 5: Commit**

```bash
git add app/\(tabs\)/
git commit -m "refactor: move tab screens from (main)/ to (tabs)/"
```

---

## Task 6: Move pushed screens to root app/ and update root _layout.tsx

Move settings, conference, and quartermaster to `app/` root. Update `app/_layout.tsx` to declare all pushed screens explicitly with their header options.

**Files:**
- Move: `app/(main)/settings.tsx` → `app/settings.tsx`
- Move: `app/(main)/conference.tsx` → `app/conference.tsx`
- Move: `app/(main)/quartermaster.tsx` → `app/quartermaster/index.tsx`
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Move settings and conference**

```bash
mv /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/settings.tsx \
   /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/settings.tsx

mv /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/conference.tsx \
   /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/conference.tsx
```

- [ ] **Step 2: Move quartermaster screens**

`quartermaster.tsx` becomes `quartermaster/index.tsx` so it can co-exist with `quartermaster/[commentId].tsx` in the same directory.

```bash
mkdir -p /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/quartermaster

mv /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/quartermaster.tsx \
   /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/quartermaster/index.tsx
```

Note: `app/(main)/quartermaster/[commentId].tsx` does not exist in the current codebase — verified before writing this plan.

- [ ] **Step 3: Fix import paths in moved screens**

`settings.tsx`, `conference.tsx`, and `quartermaster/index.tsx` were in `app/(main)/` and imported from `../../features/`. They are now in `app/` (or `app/quartermaster/`), so the relative paths change.

For `app/settings.tsx` and `app/conference.tsx` — change `../../features/` → `../features/`:

```bash
grep -n "from '\.\." /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/settings.tsx
grep -n "from '\.\." /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/conference.tsx
```

In `app/settings.tsx`, update:
```tsx
import { PilgrimageSettingsScreen } from '../features/@app-core/features/settings/screens/SettingsScreen';
```

In `app/conference.tsx`, update:
```tsx
import { PilgrimageConferenceScreen } from '../features/@app-core/features/conference/screens/ConferenceScreen';
```

For `app/quartermaster/index.tsx` — it was at depth `app/(main)/quartermaster.tsx` (2 levels from root) and is now at `app/quartermaster/index.tsx` (also 2 levels from root), so imports are unchanged:
```tsx
import { PilgrimageQuartermasterScreen } from '../../features/@app-core/features/quartermaster/screens/QuartermasterScreen';
```

- [ ] **Step 4: Remove Stack.Screen from moved route files**

The moved screens still have `<Stack.Screen options={{ title: '...' }} />` inside their JSX. This was the old pattern for setting options from inside the screen. In the new structure, options are set in the parent layout. Remove `Stack.Screen` from each file:

`app/settings.tsx`:
```tsx
import { PilgrimageSettingsScreen } from '../features/@app-core/features/settings/screens/SettingsScreen';

export default function SettingsRoute() {
  return <PilgrimageSettingsScreen />;
}
```

`app/conference.tsx`:
```tsx
import { PilgrimageConferenceScreen } from '../features/@app-core/features/conference/screens/ConferenceScreen';

export default function ConferenceRoute() {
  return <PilgrimageConferenceScreen />;
}
```

`app/quartermaster/index.tsx`:
```tsx
import { PilgrimageQuartermasterScreen } from '../../features/@app-core/features/quartermaster/screens/QuartermasterScreen';

export default function QuartermasterRoute() {
  return <PilgrimageQuartermasterScreen />;
}
```

- [ ] **Step 5: Update app/_layout.tsx**

Replace the entire contents of `app/_layout.tsx` with:

```tsx
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';

import { AppToastHost } from '../features/@app-core/components/AppToastHost';
import { sharedHeaderStyles } from '../features/@app-core/components/pilgrimage/getStackScreenOptions';
import { OFFICE_OPTIONS } from '../features/@app-core/features/breviary/helpers/pilgrimageBreviary.helpers';
import { UserLocationProvider } from '../features/@app-core/hooks/useUserLocation';
import { usePushNotifications } from '../features/@app-core/hooks/usePushNotifications';
import { brewiarzApi } from '../features/@app-core/services/brewiarzApi';
import { niedzielaApi } from '../features/@app-core/services/niedzielaApi';
import { persistor, store } from '../features/@app-core/store/store';
import '../global.css';

function AppBootstrap() {
  usePushNotifications();

  useEffect(() => {
    store.dispatch(
      niedzielaApi.util.prefetch('getDailyReadings', undefined, {
        force: false,
      })
    );

    for (const { id } of OFFICE_OPTIONS) {
      store.dispatch(
        brewiarzApi.util.prefetch('getBreviaryOffice', id, {
          force: false,
        })
      );
    }
  }, []);

  return (
    <SafeAreaProvider>
      <UserLocationProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              ...sharedHeaderStyles,
              headerShown: true,
              title: 'Ustawienia',
              headerRight: undefined,
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="conference"
            options={{
              ...sharedHeaderStyles,
              headerShown: true,
              title: 'Konferencja',
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="quartermaster"
            options={{
              ...sharedHeaderStyles,
              headerShown: true,
              title: 'Kwatermistrz',
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
            }}
          />
        </Stack>
        <AppToastHost />
      </UserLocationProvider>
    </SafeAreaProvider>
  );
}

function RootProviders() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppBootstrap />
      </PersistGate>
    </Provider>
  );
}

export default function RootLayout() {
  return <RootProviders />;
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add app/settings.tsx app/conference.tsx app/quartermaster/ app/_layout.tsx
git commit -m "refactor: move pushed screens to root app/, update _layout.tsx with explicit Stack.Screen entries"
```

---

## Task 7: Update prayer/_layout.tsx with settings button on root screen

The prayer tab has `headerShown: false` in the Tabs config (the prayer Stack manages its own header). Add the settings button on the prayer root screen, back button on sub-screens.

**Files:**
- Modify: `app/(tabs)/prayer/_layout.tsx`

- [ ] **Step 1: Rewrite prayer/_layout.tsx**

Replace the entire contents of `app/(tabs)/prayer/_layout.tsx` with:

```tsx
import { Stack } from 'expo-router';

import { SettingsButton } from '../../../features/@app-core/components/SettingsButton';
import { HeaderBackButton } from '../../../features/@app-core/components/HeaderBackButton';
import { sharedHeaderStyles } from '../../../features/@app-core/components/pilgrimage/getStackScreenOptions';

export default function PrayerLayout() {
  return (
    <Stack
      screenOptions={({ route, navigation }) => ({
        ...sharedHeaderStyles,
        headerRight: route.name === 'index' ? () => <SettingsButton /> : undefined,
        headerLeft:
          navigation.canGoBack()
            ? () => <HeaderBackButton onPress={() => navigation.goBack()} />
            : undefined,
        gestureEnabled: true,
        fullScreenGestureEnabled: false,
      })}>
      <Stack.Screen
        name="book"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(tabs)/prayer/_layout.tsx"
git commit -m "feat: add settings button to prayer root screen header"
```

---

## Task 8: Remove Stack.Screen from tab screen files

Tab screens (`index.tsx`, `route.tsx`, `news.tsx`, prayer screens) still have `<Stack.Screen options={{ title: '...' }} />` inside their JSX. In the new Tabs setup, titles are set in `_layout.tsx`. Remove these.

**Files:**
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/route.tsx`
- Modify: `app/(tabs)/news.tsx`
- Modify: `app/(tabs)/prayer/index.tsx`
- Modify: `app/(tabs)/prayer/breviary.tsx`
- Modify: `app/(tabs)/prayer/readings.tsx`

- [ ] **Step 1: Clean up index.tsx**

Replace `app/(tabs)/index.tsx` with:

```tsx
import { useRouter } from 'expo-router';

import { PilgrimageHomeScreen } from '../../features/@app-core/features/home/screens/HomeScreen';

export default function HomeRoute() {
  const router = useRouter();

  return (
    <PilgrimageHomeScreen
      onShowConference={() => router.push('/conference')}
      onShowQuartermaster={() => router.push('/quartermaster')}
    />
  );
}
```

- [ ] **Step 2: Clean up route.tsx**

Replace `app/(tabs)/route.tsx` with:

```tsx
import { PilgrimageRouteScreen } from '../../features/@app-core/features/route/screens/RouteScreen';

export default function RouteRoute() {
  return <PilgrimageRouteScreen />;
}
```

- [ ] **Step 3: Clean up news.tsx**

Replace `app/(tabs)/news.tsx` with:

```tsx
import { PilgrimageNewsScreen } from '../../features/@app-core/features/news/screens/NewsScreen';

export default function NewsRoute() {
  return <PilgrimageNewsScreen />;
}
```

- [ ] **Step 4: Clean up prayer/index.tsx**

Replace `app/(tabs)/prayer/index.tsx` with:

```tsx
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { PilgrimagePrayerScreen } from '../../../features/@app-core/features/prayer/screens/PrayerScreen';

export default function PrayerRoute() {
  const router = useRouter();

  const handleNavigateToBreviary = useCallback(() => router.push('/prayer/breviary'), [router]);
  const handleNavigateToReadings = useCallback(() => router.push('/prayer/readings'), [router]);
  const handleNavigateToPrayerBook = useCallback(() => router.push('/prayer/book'), [router]);

  return (
    <PilgrimagePrayerScreen
      onNavigateToBreviary={handleNavigateToBreviary}
      onNavigateToReadings={handleNavigateToReadings}
      onNavigateToPrayerBook={handleNavigateToPrayerBook}
    />
  );
}
```

- [ ] **Step 5: Clean up prayer/breviary.tsx**

Replace `app/(tabs)/prayer/breviary.tsx` with:

```tsx
import { PilgrimageBreviaryScreen } from '../../../features/@app-core/features/breviary/screens/BreviaryScreen';

export default function PrayerBreviaryRoute() {
  return <PilgrimageBreviaryScreen />;
}
```

- [ ] **Step 6: Clean up prayer/readings.tsx**

Replace `app/(tabs)/prayer/readings.tsx` with:

```tsx
import { PilgrimageMassReadingsScreen } from '../../../features/@app-core/features/mass-readings/screens/MassReadingsScreen';

export default function PrayerReadingsRoute() {
  return <PilgrimageMassReadingsScreen />;
}
```

- [ ] **Step 7: Add titles to prayer Stack in _layout.tsx**

The prayer sub-screens lost their titles from `Stack.Screen`. Add explicit `Stack.Screen` entries to `app/(tabs)/prayer/_layout.tsx`:

Update the file to add title declarations inside the `<Stack>`:

```tsx
import { Stack } from 'expo-router';

import { SettingsButton } from '../../../features/@app-core/components/SettingsButton';
import { HeaderBackButton } from '../../../features/@app-core/components/HeaderBackButton';
import { sharedHeaderStyles } from '../../../features/@app-core/components/pilgrimage/getStackScreenOptions';

export default function PrayerLayout() {
  return (
    <Stack
      screenOptions={({ route, navigation }) => ({
        ...sharedHeaderStyles,
        headerRight: route.name === 'index' ? () => <SettingsButton /> : undefined,
        headerLeft:
          navigation.canGoBack()
            ? () => <HeaderBackButton onPress={() => navigation.goBack()} />
            : undefined,
        gestureEnabled: true,
        fullScreenGestureEnabled: false,
      })}>
      <Stack.Screen name="index" options={{ title: 'Niezbędnik' }} />
      <Stack.Screen name="breviary" options={{ title: 'Brewiarz' }} />
      <Stack.Screen name="readings" options={{ title: 'Czytania z Mszy' }} />
      <Stack.Screen name="book" options={{ headerShown: false }} />
    </Stack>
  );
}
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add "app/(tabs)/"
git commit -m "refactor: remove Stack.Screen from tab screen files, titles declared in layouts"
```

---

## Task 9: Delete (main)/_layout.tsx and AppShell

The `(main)` directory should now be empty (all files moved). Delete the layout and the now-unused `AppShell` component.

**Files:**
- Delete: `app/(main)/_layout.tsx`
- Delete: `features/@app-core/components/AppShell.tsx`

- [ ] **Step 1: Verify (main)/ is empty**

```bash
ls /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/
```

Expected: only `_layout.tsx` remains. If any other files appear, they were missed in earlier tasks — move them before continuing.

- [ ] **Step 2: Delete the (main) layout**

```bash
rm /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/_layout.tsx
rmdir /Users/mlenqe/Praca/private_projects/bppnjg-mobile/app/\(main\)/
```

- [ ] **Step 3: Check AppShell has no remaining usages**

```bash
grep -r "AppShell" /Users/mlenqe/Praca/private_projects/bppnjg-mobile --include="*.tsx" --include="*.ts"
```

Expected: no results. If any found, remove those imports/usages first.

- [ ] **Step 4: Delete AppShell**

```bash
rm /Users/mlenqe/Praca/private_projects/bppnjg-mobile/features/@app-core/components/AppShell.tsx
```

- [ ] **Step 5: Check features/@app-core/index.ts for AppShell export**

```bash
grep "AppShell" /Users/mlenqe/Praca/private_projects/bppnjg-mobile/features/@app-core/index.ts
```

If found, remove that line from `features/@app-core/index.ts`.

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: delete (main) layout group and AppShell component"
```

---

## Task 10: Manual smoke test

Run the app and verify the key behaviors.

- [ ] **Step 1: Start the app**

```bash
npx expo start
```

Press `i` for iOS simulator or `a` for Android.

- [ ] **Step 2: Verify no header jump on tab switch**

Switch between all four tabs (Start → Trasa → Niezbędnik → Info). The header should update title without any visible animation or jump.

- [ ] **Step 3: Verify settings gear always visible**

Check that the gear icon appears in the top-right on all four main tabs. Tap it — settings screen should open with a back button and slide animation.

- [ ] **Step 4: Verify prayer sub-navigation**

Navigate to Niezbędnik tab. Verify gear icon visible. Tap Brewiarz — verify back button appears and gear disappears. Navigate back.

- [ ] **Step 5: Verify conference and quartermaster**

From home, trigger conference and quartermaster navigation. Verify they push with slide animation, show correct titles, and back button returns to home.

- [ ] **Step 6: Verify notifications badge**

Info tab should show red dot if there are unread notifications.

- [ ] **Step 7: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: smoke test fixes"
```
