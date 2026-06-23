# Global Color System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralise all app colors in `AppColors` (new file), wire the theme to it, and apply `AppColors.background = #f2f2f7` as the universal screen + header background.

**Architecture:** A new `packages/@app-ui/theme/colors.ts` exports `AppColors as const`. `pilgrimageRouteTheme` replaces its inline `colors` object with `AppColors`. Every screen that previously set `backgroundColor: colors.surface` on its root scroll view switches to `AppColors.background`. The navigation header in `getStackScreenOptions.tsx` does the same.

**Tech Stack:** React Native / Expo, TypeScript, expo-router

## Global Constraints

- New background token: `#f2f2f7` (iOS-system gray)
- `surface` stays `#fbf7f2` — used only for card/component interiors going forward
- No changes to card interior colors in this pass
- Import path to `@app-ui` from feature screens: `'../../../../../packages/@app-ui'`
- Import path to `@app-ui` from `getStackScreenOptions.tsx`: `'../../../../packages/@app-ui'`

---

### Task 1: Create `AppColors` and wire the theme

**Files:**
- Create: `packages/@app-ui/theme/colors.ts`
- Modify: `packages/@app-ui/theme/pilgrimageRouteTheme.ts`
- Modify: `packages/@app-ui/index.ts`

**Interfaces:**
- Produces: `AppColors` exported from `packages/@app-ui` — object with all color tokens including `background: '#f2f2f7'`

- [ ] **Step 1: Create `packages/@app-ui/theme/colors.ts`**

```ts
export const AppColors = {
  // Screen backgrounds and navigation headers
  background: '#f2f2f7',

  // Cards / elevated components
  surface: '#fbf7f2',
  surfaceDim: '#e3dbd3',
  surfaceBright: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5efe8',
  surfaceContainer: '#eee7dc',
  surfaceContainerHigh: '#e8dfd4',
  surfaceContainerHighest: '#dfd3c6',
  surfaceVariant: '#eee7dc',
  surfaceTint: '#6a003f',

  // Text
  onBackground: '#1a1d21',
  onSurface: '#1a1d21',
  onSurfaceVariant: '#6f625d',

  // Inverse
  inverseSurface: '#2f3136',
  inverseOnSurface: '#f6f2ed',

  // Borders
  outline: '#d6c8b8',
  outlineVariant: '#eadfd1',

  // Brand — primary
  primary: '#6a003f',
  onPrimary: '#ffffff',
  primaryContainer: '#f9e6f0',
  onPrimaryContainer: '#6a003f',
  inversePrimary: '#ffb0cf',

  // Secondary
  secondary: '#7c6f67',
  onSecondary: '#ffffff',
  secondaryContainer: '#efe7dc',
  onSecondaryContainer: '#62564f',

  // Tertiary
  tertiary: '#756cf6',
  onTertiary: '#ffffff',
  tertiaryContainer: '#ece8ff',
  onTertiaryContainer: '#5d53d8',
} as const;
```

- [ ] **Step 2: Update `packages/@app-ui/theme/pilgrimageRouteTheme.ts`**

Replace the entire file:

```ts
import { AppColors } from './colors';

export const pilgrimageRouteTheme = {
  name: 'PilgrimageRoute',
  colors: AppColors,
  spacing: {
    xs: 4,
    sm: 12,
    md: 24,
    lg: 48,
    xl: 80,
  },
  radii: {
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    fontFamily: 'Manrope',
  },
} as const;
```

- [ ] **Step 3: Update `packages/@app-ui/index.ts`**

```ts
export * from './components/icons/Icons';
export * from './theme/pilgrimageRouteTheme';
export * from './theme/colors';
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/mlenqe/Praca/private_projects/bppnjg-mobile
npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors related to the new files.

- [ ] **Step 5: Commit**

```bash
git add packages/@app-ui/theme/colors.ts packages/@app-ui/theme/pilgrimageRouteTheme.ts packages/@app-ui/index.ts
git commit -m "feat: add AppColors to @app-ui, wire pilgrimageRouteTheme to it"
```

---

### Task 2: Unified navigation header background

**Files:**
- Modify: `features/@app-core/components/pilgrimage/getStackScreenOptions.tsx`

**Interfaces:**
- Consumes: `AppColors` from `'../../../../packages/@app-ui'`
- Produces: `sharedHeaderStyles.headerStyle.backgroundColor === AppColors.background`

- [ ] **Step 1: Update `getStackScreenOptions.tsx`**

Replace the entire file content:

```tsx
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { AppColors, pilgrimageRouteTheme } from '../../../../packages/@app-ui';
import { HeaderBackButton } from '../HeaderBackButton';

const { typography } = pilgrimageRouteTheme;

export type SharedHeaderOptions = Pick<
  NativeStackNavigationOptions,
  | 'headerShadowVisible'
  | 'headerTransparent'
  | 'headerStyle'
  | 'headerTitleStyle'
  | 'headerTintColor'
  | 'headerTitleAlign'
>;

export const sharedHeaderStyles: SharedHeaderOptions = {
  headerShadowVisible: false,
  headerTransparent: false,
  headerStyle: {
    backgroundColor: AppColors.background,
  },
  headerTitleStyle: {
    color: AppColors.onBackground,
    fontFamily: typography.fontFamily,
    fontSize: 24,
    fontWeight: '700',
  },
  headerTintColor: AppColors.onBackground,
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
      headerBackVisible: false,
      headerLeft,
    };
  };
}
```

Note: `colors.onSurface` is replaced with `AppColors.onBackground` for header text/tint — same value (`#1a1d21`), now using the semantically correct token.

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 3: Commit**

```bash
git add features/@app-core/components/pilgrimage/getStackScreenOptions.tsx
git commit -m "feat: use AppColors.background for navigation header"
```

---

### Task 3: Screen backgrounds — tab screens

**Files:**
- Modify: `features/@app-core/features/home/screens/HomeScreen.tsx`
- Modify: `features/@app-core/features/news/screens/NewsScreen.tsx`
- Modify: `features/@app-core/features/route/screens/RouteScreen.tsx`

**Interfaces:**
- Consumes: `AppColors` from `'../../../../../packages/@app-ui'`

Pattern for every change in this task and Task 4–5:
1. Add `AppColors` to the existing `@app-ui` import
2. Replace every `style={{ backgroundColor: colors.surface }}` on a root ScrollView/View with `style={{ backgroundColor: AppColors.background }}`

- [ ] **Step 1: Update `HomeScreen.tsx`**

Change the import line (line 4):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

Change line 94:
```tsx
// FROM:
        style={{ backgroundColor: colors.surface }}
// TO:
        style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 2: Update `NewsScreen.tsx`**

Change the import line (line 6):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

Change line 69:
```tsx
// FROM:
      style={{ backgroundColor: colors.surface }}
// TO:
      style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 3: Update `RouteScreen.tsx`**

Change the import line (line 4):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

There are three `backgroundColor: colors.surface` occurrences (lines 75, 85, 127). Replace all three:
```tsx
// FROM (all three instances):
        style={{ backgroundColor: colors.surface }}
// TO:
        style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 5: Commit**

```bash
git add features/@app-core/features/home/screens/HomeScreen.tsx \
        features/@app-core/features/news/screens/NewsScreen.tsx \
        features/@app-core/features/route/screens/RouteScreen.tsx
git commit -m "feat: use AppColors.background in tab screen backgrounds"
```

---

### Task 4: Screen backgrounds — stack/modal screens

**Files:**
- Modify: `features/@app-core/features/quartermaster/screens/QuartermasterScreen.tsx`
- Modify: `features/@app-core/features/conference/screens/ConferenceScreen.tsx`
- Modify: `features/@app-core/features/settings/screens/SettingsScreen.tsx`
- Modify: `features/@app-core/features/mass-readings/screens/MassReadingsScreen.tsx`
- Modify: `features/@app-core/features/breviary/screens/BreviaryScreen.tsx`

**Interfaces:**
- Consumes: `AppColors` from `'../../../../../packages/@app-ui'`

- [ ] **Step 1: Update `QuartermasterScreen.tsx`**

Change import (line 4):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

Change line 27:
```tsx
// FROM:
      style={{ backgroundColor: colors.surface }}
// TO:
      style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 2: Update `ConferenceScreen.tsx`**

Change import (line 3):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

Find and replace the one `backgroundColor: colors.surface` line (line 168) in the root ScrollView:
```tsx
// FROM:
      style={{ backgroundColor: colors.surface }}
// TO:
      style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 3: Update `SettingsScreen.tsx`**

Change import (line 6):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

Change line 110 (root ScrollView background):
```tsx
// FROM:
      style={{ backgroundColor: colors.surface }}
// TO:
      style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 4: Update `MassReadingsScreen.tsx`**

Change import (line 4):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

Change line 29 (root ScrollView):
```tsx
// FROM:
      style={{ backgroundColor: colors.surface }}
// TO:
      style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 5: Update `BreviaryScreen.tsx`**

Change import (line 4):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

Change line 36 (root ScrollView):
```tsx
// FROM:
      style={{ backgroundColor: colors.surface }}
// TO:
      style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 7: Commit**

```bash
git add features/@app-core/features/quartermaster/screens/QuartermasterScreen.tsx \
        features/@app-core/features/conference/screens/ConferenceScreen.tsx \
        features/@app-core/features/settings/screens/SettingsScreen.tsx \
        features/@app-core/features/mass-readings/screens/MassReadingsScreen.tsx \
        features/@app-core/features/breviary/screens/BreviaryScreen.tsx
git commit -m "feat: use AppColors.background in stack/modal screen backgrounds"
```

---

### Task 5: Screen backgrounds — prayer screens + hardcoded fix

**Files:**
- Modify: `features/@app-core/features/prayer/screens/PrayerScreen.tsx`
- Modify: `features/@app-core/features/prayer/screens/PrayerBookScreen.tsx`
- Modify: `features/@app-core/features/prayer/screens/PrayerBookEntryScreen.tsx`

**Interfaces:**
- Consumes: `AppColors` from `'../../../../../packages/@app-ui'`

- [ ] **Step 1: Update `PrayerScreen.tsx`**

This file has a hardcoded `'#f3f5f8'` that needs replacing.

Change import (lines 8–11):
```ts
// FROM:
import {
  pilgrimageRouteTheme,
} from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

Change line 56:
```tsx
// FROM:
      style={{ backgroundColor: '#f3f5f8' }}
// TO:
      style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 2: Update `PrayerBookScreen.tsx`**

Change import (line 4):
```ts
// FROM:
import { pilgrimageRouteTheme, PrayerBookIcon } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme, PrayerBookIcon } from '../../../../../packages/@app-ui';
```

Change line 21 (root ScrollView):
```tsx
// FROM:
      style={{ backgroundColor: colors.surface }}
// TO:
      style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 3: Update `PrayerBookEntryScreen.tsx`**

Change import (line 5):
```ts
// FROM:
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
// TO:
import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
```

There are two `backgroundColor: colors.surface` occurrences (lines 72 and 88). Replace both:
```tsx
// FROM (both instances):
        style={{ backgroundColor: colors.surface }}
// TO:
        style={{ backgroundColor: AppColors.background }}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 5: Commit**

```bash
git add features/@app-core/features/prayer/screens/PrayerScreen.tsx \
        features/@app-core/features/prayer/screens/PrayerBookScreen.tsx \
        features/@app-core/features/prayer/screens/PrayerBookEntryScreen.tsx
git commit -m "feat: use AppColors.background in prayer screens, fix hardcoded #f3f5f8"
```

---

### Task 6: Visual verification

- [ ] **Step 1: Start the dev server**

```bash
npx expo start
```

- [ ] **Step 2: Check each screen**

Open the app and visually verify:
- [ ] Home tab — background is light gray (`#f2f2f7`), header matches
- [ ] Route tab — background is light gray, header matches
- [ ] Info tab — background is light gray, header matches
- [ ] Niezbędnik tab — background is light gray, header matches
- [ ] Brewiarz screen — background is light gray, header matches
- [ ] Czytania z Mszy screen — background is light gray, header matches
- [ ] Modlitewnik screen — background is light gray, header matches
- [ ] Kwatermistrz screen — background is light gray, header matches
- [ ] Konferencja screen — background is light gray, header matches
- [ ] Ustawienia screen — background is light gray, header matches
- [ ] Cards / carousels inside screens — still have their warm/white backgrounds

- [ ] **Step 3: Final commit if any visual fixes needed**

```bash
git add -p
git commit -m "fix: visual corrections after AppColors.background rollout"
```
