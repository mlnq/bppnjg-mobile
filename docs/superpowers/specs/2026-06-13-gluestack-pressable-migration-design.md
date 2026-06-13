# GlueStack Pressable Migration

**Date:** 2026-06-13
**Scope:** Replace all `TouchableOpacity` and RN `Pressable` with GlueStack `Pressable` across the project.

## Goal

Adopt GlueStack's headless `Pressable` component (already installed via `@gluestack-ui/core`) as the single touch interaction primitive, replacing React Native's `TouchableOpacity` and `Pressable`. Styling via NativeWind (`active:opacity-*` classes) replaces the `activeOpacity` prop.

## Approach

Single component generated once, then mechanically substituted in all files. No Button adoption in this scope — all elements have custom theming that makes a generic Button variant unnecessary.

## Step 1 — Generate Component

```bash
npx gluestack-ui add pressable
```

Output: `components/ui/pressable/index.tsx`

## Step 2 — Substitution Rules

| Old | New |
|-----|-----|
| `import { TouchableOpacity } from 'react-native'` | `import { Pressable } from '@/components/ui/pressable'` |
| `import { Pressable } from 'react-native'` | `import { Pressable } from '@/components/ui/pressable'` |
| `<TouchableOpacity activeOpacity={0.75} ...>` | `<Pressable className="active:opacity-75" ...>` |
| `<TouchableOpacity activeOpacity={0.8} ...>` | `<Pressable className="active:opacity-80" ...>` |
| `<TouchableOpacity activeOpacity={0.9} ...>` | `<Pressable className="active:opacity-90" ...>` |
| `<TouchableOpacity>` (no activeOpacity) | `<Pressable className="active:opacity-80" ...>` |
| `</TouchableOpacity>` | `</Pressable>` |

All other props (`onPress`, `disabled`, `style`, `className`, `key`) pass through unchanged.

When `TouchableOpacity` is removed from a `react-native` import that still imports other symbols, keep the import and remove only `TouchableOpacity`. If it was the only import, remove the entire import line.

## Step 3 — Files to Modify

### Shared components (9 files)
- `features/@app-core/components/Card.tsx` — `CardButton` (style array, passes through fine)
- `features/@app-core/components/HeaderBackButton.tsx` — RN `Pressable` → GlueStack
- `features/@app-core/components/SettingsButton.tsx` — RN `Pressable` → GlueStack
- `features/@app-core/components/ReadingFontSizeControl.tsx`
- `features/@app-core/components/DevInfoCard.tsx`
- `features/@app-core/components/pilgrimage/BottomNav.tsx`
- `features/@app-core/components/pilgrimage/RouteHeader.tsx`
- `features/@app-core/components/pilgrimage/RouteLocationInfoModal.tsx`
- `features/@app-core/components/pilgrimage/LatestNewsSection.tsx`

### Feature screens & components (15 files)
- `features/@app-core/features/home/components/HomeHeroCard.tsx`
- `features/@app-core/features/home/components/WeatherCard.tsx`
- `features/@app-core/features/route/screens/RouteScreen.tsx`
- `features/@app-core/features/route/components/RoutePositionBadge.tsx`
- `features/@app-core/features/route/components/RouteHeroCard.tsx`
- `features/@app-core/features/prayer/screens/PrayerScreen.tsx`
- `features/@app-core/features/prayer/screens/PrayerBookScreen.tsx`
- `features/@app-core/features/prayer/screens/PrayerBookEntryScreen.tsx`
- `features/@app-core/features/breviary/components/BreviarySectionCard.tsx`
- `features/@app-core/features/breviary/components/OfficeTabs.tsx`
- `features/@app-core/features/news/screens/NewsScreen.tsx`
- `features/@app-core/features/news/components/NewsCard.tsx`
- `features/@app-core/features/quartermaster/components/QuartermasterCard.tsx`
- `features/@app-core/features/conference/screens/ConferenceScreen.tsx`
- `features/@app-core/features/mass-readings/screens/MassReadingsScreen.tsx`
- `features/@app-core/features/settings/screens/SettingsScreen.tsx`

## Special Cases

**CardButton (`Card.tsx`):** Has `style={[cardBaseStyle, { backgroundColor, borderColor, borderWidth }, style]}`. GlueStack `Pressable` accepts `style` as an array — no logic change needed.

**HeaderBackButton / SettingsButton:** Currently import `Pressable` from `react-native` and use `StyleSheet`. The swap is import-only; `StyleSheet` usage and `style` prop remain.

## Out of Scope

- GlueStack `Button` component adoption
- Any styling changes beyond replacing `activeOpacity` with `active:opacity-*`
- `SlideOverPanel`, `AppToastHost`, or any other structural components
