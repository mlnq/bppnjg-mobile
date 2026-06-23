# Global Color System & Unified Background

**Date:** 2026-06-23
**Branch:** feature/ui-update

## Problem

The app currently has inconsistent backgrounds and headers:

- Screen backgrounds use `colors.surface` (`#fbf7f2`, warm cream) — semantically wrong; `surface` should mean cards/components
- Navigation header background is hardcoded `#fcfaf7` in `getStackScreenOptions.tsx` — a slightly different warm cream
- `PrayerScreen.tsx` uses its own hardcoded `#f3f5f8`
- No single source of truth for color tokens; color values scattered across files

## Goal

1. One file (`packages/@app-ui/theme/colors.ts`) with all color tokens as named exports
2. Light gray (`#f2f2f7`) as the universal screen background, shared by headers and screens
3. All screens reference `AppColors.background` — zero hardcoded background values

## Solution

### New file: `packages/@app-ui/theme/colors.ts`

Single source of truth. Exports `AppColors` with semantic grouping:

```ts
export const AppColors = {
  // Screen backgrounds + navigation headers
  background: '#f2f2f7',

  // Cards / elevated components
  surface: '#ffffff',
  surfaceDim: '#e3dbd3',
  surfaceBright: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5efe8',
  surfaceContainer: '#eee7dc',
  surfaceContainerHigh: '#e8dfd4',
  surfaceContainerHighest: '#dfd3c6',
  surfaceVariant: '#eee7dc',
  surfaceTint: '#6a003f',

  // Text on backgrounds
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

### Updated: `pilgrimageRouteTheme.ts`

Import `AppColors` and replace inline values. The theme object structure stays intact for backward compatibility with existing consumers.

### Updated: `packages/@app-ui/index.ts`

Add `export * from './theme/colors'` so `AppColors` is importable from `@app-ui`.

### Updated: `getStackScreenOptions.tsx`

Replace hardcoded `headerStyle.backgroundColor: '#fcfaf7'` with `AppColors.background`.

### Updated: all screen files

Replace every screen-level `style={{ backgroundColor: colors.surface }}` with `AppColors.background`.

Files to update:
- `features/@app-core/features/home/screens/HomeScreen.tsx`
- `features/@app-core/features/news/screens/NewsScreen.tsx`
- `features/@app-core/features/route/screens/RouteScreen.tsx`
- `features/@app-core/features/quartermaster/screens/QuartermasterScreen.tsx`
- `features/@app-core/features/prayer/screens/PrayerScreen.tsx` (also fixes hardcoded `#f3f5f8`)
- `features/@app-core/features/prayer/screens/PrayerBookScreen.tsx`
- `features/@app-core/features/prayer/screens/PrayerBookEntryScreen.tsx`
- `features/@app-core/features/settings/screens/SettingsScreen.tsx`
- `features/@app-core/features/conference/screens/ConferenceScreen.tsx`
- `features/@app-core/features/mass-readings/screens/MassReadingsScreen.tsx`
- `features/@app-core/features/breviary/screens/BreviaryScreen.tsx`

## Out of scope

Card/component interior colors (warm surfaces like `surfaceContainerLow: #f5efe8`) are not changed in this pass — that is a separate design decision.

## Result

- `#f2f2f7` everywhere as screen background, including headers
- One import: `import { AppColors } from '@app-ui'` or from the theme package path
- No hardcoded color values for backgrounds in screen files
