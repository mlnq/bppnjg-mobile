# Expo Tabs Navigation Redesign

**Date:** 2026-06-13  
**Status:** Approved

## Problem

The current app uses a single `<Stack>` navigator in `app/(main)/_layout.tsx` with `router.replace()` to simulate tab switching. This causes visible header jumping when switching tabs. The settings gear icon appears only on the home screen (`SETTINGS_VISIBLE_ROUTES = new Set(['index'])`). The `(main)/` group is an unnecessary wrapper that doesn't follow Expo Router conventions.

## Goals

1. Eliminate header jumping when switching tabs
2. Settings gear always visible in the top-right corner on all main tab screens
3. Structure follows Expo Router documentation — canonical `(tabs)/` pattern

## Target File Structure

```
app/
  _layout.tsx                    ← Root Stack + all providers (Redux, SafeArea, etc.)
  (tabs)/
    _layout.tsx                  ← <Tabs> with custom tabBar + settings in every header
    index.tsx                    ← Start (home tab)
    route.tsx                    ← Trasa (route tab)
    news.tsx                     ← Info (info tab)
    prayer/
      _layout.tsx                ← Stack — prayer sub-navigation, own header
      index.tsx                  ← Niezbędnik (prayer tab root)
      breviary.tsx
      readings.tsx
      book/
        _layout.tsx
        index.tsx
        [entryId].tsx
  settings.tsx                   ← pushed from root Stack
  conference.tsx                 ← pushed from root Stack
  quartermaster/
    index.tsx                    ← pushed from root Stack (was quartermaster.tsx)
    [commentId].tsx              ← pushed from root Stack
```

## Why This Structure

- `(tabs)/` is the canonical Expo Router group for tab screens — it is transparent in URLs
- Pushed screens (settings, conference, quartermaster) live at root `app/` level, pushed by the root Stack
- No intermediate `(main)/` wrapper — it added nothing and obscured intent
- `quartermaster/index.tsx` instead of `quartermaster.tsx` — avoids file/directory naming conflict with `quartermaster/[commentId].tsx`
- `app/_layout.tsx` explicitly declares all Stack screens so options are visible in one place

## Navigation Architecture

```
Root Stack (app/_layout.tsx)
│   Providers: Redux, PersistGate, SafeAreaProvider, UserLocation
│   Declares Stack.Screen for every screen explicitly
│
├── (tabs)/_layout.tsx      <Tabs tabBar={TabBarAdapter}>
│       screenOptions: header styles + headerRight: <SettingsButton /> on every tab
│
│   ├── index.tsx           title="Start"
│   ├── route.tsx           title="Trasa"
│   ├── news.tsx            title="Info"
│   └── prayer/
│       ├── _layout.tsx     Stack — own header, settings on root screen only
│       ├── index.tsx       title="Niezbędnik"
│       ├── breviary.tsx
│       ├── readings.tsx
│       └── book/
│           ├── _layout.tsx
│           ├── index.tsx
│           └── [entryId].tsx
│
├── settings.tsx            title="Ustawienia", slide_from_right, no settings gear
├── conference.tsx          slide_from_right
└── quartermaster/
    ├── index.tsx           slide_from_right
    └── [commentId].tsx     slide_from_right
```

## File Changes

### Files to Create

| File | Description |
|---|---|
| `app/(tabs)/_layout.tsx` | New Tabs layout |

### Files to Move

All URL routes remain identical — `(tabs)` group is transparent.

| From | To |
|---|---|
| `app/(main)/index.tsx` | `app/(tabs)/index.tsx` |
| `app/(main)/route.tsx` | `app/(tabs)/route.tsx` |
| `app/(main)/news.tsx` | `app/(tabs)/news.tsx` |
| `app/(main)/prayer/_layout.tsx` | `app/(tabs)/prayer/_layout.tsx` |
| `app/(main)/prayer/index.tsx` | `app/(tabs)/prayer/index.tsx` |
| `app/(main)/prayer/breviary.tsx` | `app/(tabs)/prayer/breviary.tsx` |
| `app/(main)/prayer/readings.tsx` | `app/(tabs)/prayer/readings.tsx` |
| `app/(main)/prayer/book/_layout.tsx` | `app/(tabs)/prayer/book/_layout.tsx` |
| `app/(main)/prayer/book/index.tsx` | `app/(tabs)/prayer/book/index.tsx` |
| `app/(main)/prayer/book/[entryId].tsx` | `app/(tabs)/prayer/book/[entryId].tsx` |
| `app/(main)/settings.tsx` | `app/settings.tsx` |
| `app/(main)/conference.tsx` | `app/conference.tsx` |
| `app/(main)/quartermaster.tsx` | `app/quartermaster/index.tsx` |
| `app/(main)/quartermaster/[commentId].tsx` | `app/quartermaster/[commentId].tsx` |

### Files to Delete

| File | Reason |
|---|---|
| `app/(main)/_layout.tsx` | Replaced by updated `app/_layout.tsx` + new `app/(tabs)/_layout.tsx` |
| `features/@app-core/components/AppShell.tsx` | Tab layout moves into `<Tabs>` |

### Files to Modify

| File | Change |
|---|---|
| `app/_layout.tsx` | Add explicit `Stack.Screen` entries; move prefetch `useEffect` here |
| `features/@app-core/components/pilgrimage/BottomNav.tsx` | Remove `absolute` positioning |
| `features/@app-core/components/pilgrimage/getStackScreenOptions.tsx` | Remove `showSettingsRoutes` param — settings always shown on root screens |

## Component Design

### `app/_layout.tsx`

```tsx
function AppBootstrap() {
  usePushNotifications();

  useEffect(() => {
    // niedzielaApi and brewiarzApi prefetch calls (unchanged)
  }, []);

  return (
    <SafeAreaProvider>
      <UserLocationProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Ustawienia',
              headerRight: undefined,
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
              ...sharedHeaderStyles,
            }}
          />
          <Stack.Screen
            name="conference"
            options={{
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
              ...sharedHeaderStyles,
            }}
          />
          <Stack.Screen
            name="quartermaster"
            options={{
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              gestureEnabled: true,
              ...sharedHeaderStyles,
            }}
          />
        </Stack>
        <AppToastHost />
      </UserLocationProvider>
    </SafeAreaProvider>
  );
}
```

`sharedHeaderStyles` — extracted constant from `getStackScreenOptions` (backgroundColor, font, colors).

### `app/(tabs)/_layout.tsx`

```tsx
export default function TabsLayout() {
  useEffect(() => {
    prefetchPilgrimageNotifications();
  }, []);

  return (
    <Tabs
      tabBar={(props) => <TabBarAdapter {...props} />}
      screenOptions={{
        headerRight: () => <SettingsButton />,
        headerShadowVisible: false,
        headerTransparent: false,
        headerStyle: { backgroundColor: '#fcfaf7' },
        headerTitleStyle: {
          color: colors.onSurface,
          fontFamily: typography.fontFamily,
          fontSize: 24,
          fontWeight: '700',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Start' }} />
      <Tabs.Screen name="route" options={{ title: 'Trasa' }} />
      <Tabs.Screen name="news" options={{ title: 'Info' }} />
      <Tabs.Screen name="prayer" options={{ headerShown: false }} />
    </Tabs>
  );
}
```

`prayer` tab sets `headerShown: false` because `prayer/_layout.tsx` (Stack) manages its own header.

### `TabBarAdapter`

Thin wrapper inside `app/(tabs)/_layout.tsx` that converts React Navigation `BottomTabBarProps` to `PilgrimageBottomNav`'s interface:

```tsx
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
  const activeRouteName = state.routes[state.index].name;
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
```

### `PilgrimageBottomNav` changes

Remove `absolute`, `bottom-0`, `left-0`, `right-0` from className. The `<Tabs>` navigator renders the tabBar in its own slot below screen content — absolute positioning is not needed and would cause double-rendering issues. Keep `useSafeAreaInsets` for bottom padding.

### `app/(tabs)/prayer/_layout.tsx`

Remains a `<Stack>`. Settings button shown only on `index` (prayer tab root); back button shown on sub-screens:

```tsx
screenOptions={({ route, navigation }) => ({
  ...sharedHeaderStyles,
  headerRight: route.name === 'index' ? () => <SettingsButton /> : undefined,
  headerLeft: navigation.canGoBack() ? () => <HeaderBackButton onPress={() => navigation.goBack()} /> : undefined,
  headerBackVisible: false,
  gestureEnabled: true,
})}
```

## What Gets Removed

| Removed | Replaced by |
|---|---|
| `AppShell` component | `<Tabs>` handles layout |
| `getActiveTab()` function | `state.index` from React Navigation in `TabBarAdapter` |
| `resetStackAndOpenTab()` function | `navigation.navigate()` in `TabBarAdapter` |
| `SETTINGS_VISIBLE_ROUTES` | `screenOptions.headerRight` always set in Tabs |
| `BACK_HIDDEN_ROUTES` | Not needed — tab root screens never have a back button |
| `(main)/` route group | Replaced by `(tabs)/` at root level |

## Constraints

- All URL routes remain identical — `(tabs)` and `(main)` are transparent groups
- `PilgrimageBottomNav` public API (`activeTab`, `onTabChange`) unchanged
- Prayer sub-navigation (book, breviary, readings) unchanged internally
- When navigating to settings/conference/quartermaster, tab bar disappears — correct behavior
- `animation: 'none'` removed from tab switching (Tabs handles this natively without animation)
