# Codebase Summary for Claude

## 1. Project shape

- Stack: Expo 54, React 19, React Native 0.81, TypeScript `strict`, Redux Toolkit + RTK Query, NativeWind.
- Workspace layout uses npm workspaces, but this is still a single mobile app repo:
  - `App.tsx` = real entrypoint
  - `features/@app-core` = app domain, screens, routes, APIs, hooks, store
  - `packages/@app-ui` = small shared UI package with theme + icons
  - `features/@app-demo` = leftover demo package, not part of runtime flow
- TS config is minimal:
  - `strict: true`
  - `baseUrl: "."`
  - no `paths` aliases
  - imports are mostly relative

## 2. Runtime composition

`App.tsx` mounts providers in this order:

1. Redux `Provider`
2. `SafeAreaProvider`
3. `UserLocationProvider`
4. `StatusBar`
5. `AppRoute`

This means screen code can assume:

- RTK Query hooks are globally available
- safe area context is available
- location context is available through `useUserLocation()`

## 3. Navigation model

There is no React Navigation.

Navigation is local state in [`features/@app-core/routes/AppRoute.tsx`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/routes/AppRoute.tsx):

- `AppTab = 'home' | 'route' | 'prayer' | 'news'`
- `PrayerRoute = 'index' | 'readings' | 'breviary'`

`AppRoute()` uses `useState` and conditionally renders screens:

- `home` -> `PilgrimageHomeScreen`
- `route` -> `PilgrimageRouteScreen`
- `news` -> `PilgrimageNewsScreen`
- `prayer/index` -> `PilgrimagePrayerScreen`
- `prayer/readings` -> `PilgrimageMassReadingsScreen`
- `prayer/breviary` -> `PilgrimageBreviaryScreen`

Shared shell lives in [`features/@app-core/components/AppLayout.tsx`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/components/AppLayout.tsx):

- top header
- active screen content
- bottom navigation

## 4. Main source of truth

The app has one dominant domain aggregate in [`features/@app-core/constants/pilgrimageRoute.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/constants/pilgrimageRoute.ts).

It defines:

- the main domain types
- seeded static data
- helper selectors/accessors

Primary exported values:

- `pilgrimage: Pilgrimage`
- `pilgrimageDay = pilgrimage.days[0]`
- `getTownById`
- `getScheduleItemTown`
- `getRouteWaypointTown`
- `getDayStartTown`
- `getDayEndTown`
- `getPilgrimageDestination`
- `getRemainingDistanceKm`

Important architectural point:

- UI route/home/news components mostly read from this static in-repo dataset.
- Remote APIs are used mainly for prayer/readings/breviary content, not for the pilgrimage route model itself.

## 5. Core domain types

Main domain type graph:

```ts
type UUID = string;

type GeoCoordinate = {
  latitude: number;
  longitude: number;
};

type Town = {
  id: UUID;
  name: string;
} & GeoCoordinate;

type RouteWaypoint = {
  id: UUID;
  routeId: UUID;
  townId: UUID;
  orderIndex: number;
  distanceToNextKm?: number;
};

type PilgrimageDayScheduleItem = {
  id: UUID;
  type: PilgrimageWaypointKind;
  time: string;
  townId: UUID;
  title: string;
  description: string;
  badge?: string;
  note?: string;
};

type PilgrimageDayRoute = {
  id: UUID;
  startTownId: UUID;
  endTownId: UUID;
  waypoints: readonly RouteWaypoint[];
  googleRoutePath?: readonly GeoCoordinate[];
  totalDistanceKm: number;
  scheduledStartTime: string;
  plannedArrivalTime: string;
};

type PilgrimageWeather = {
  temperatureC: number;
  summary: string;
  icon: 'sunny' | 'cloudy' | 'rain' | 'storm' | 'partlyCloudy';
};

type PilgrimageReflection = {
  title: string;
  quote: string;
  reference: string;
};

type PilgrimageNewsItem = {
  id: UUID;
  title: string;
  summary: string;
  publishedAt: string;
  category: 'announcement' | 'logistics' | 'spiritual' | 'weather';
  isPinned?: boolean;
};

type PilgrimageDay = {
  id: UUID;
  pilgrimageId: UUID;
  dayNumber: number;
  title: string;
  date: string;
  route: PilgrimageDayRoute;
  schedule: readonly PilgrimageDayScheduleItem[];
  reflection: PilgrimageReflection;
  weather: PilgrimageWeather;
  news: readonly PilgrimageNewsItem[];
};

type Pilgrimage = {
  id: UUID;
  name: string;
  startDate: string;
  destinationTownId: UUID;
  totalDays: number;
  towns: readonly Town[];
  days: readonly PilgrimageDay[];
};
```

Literal unions used across UI:

- `PilgrimageWaypointKind = 'start' | 'rest' | 'meal' | 'info' | 'mass' | 'night' | 'medical' | 'prayer'`
- `PilgrimageWeatherIcon = 'sunny' | 'cloudy' | 'rain' | 'storm' | 'partlyCloudy'`
- `PilgrimageNewsCategory = 'announcement' | 'logistics' | 'spiritual' | 'weather'`

## 6. Data flow by feature

### Route / Home / News

Mostly built from `pilgrimage` and `pilgrimageDay`.

Helpers:

- [`features/@app-core/utils/pilgrimageCurrentLocation.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/utils/pilgrimageCurrentLocation.ts)
  - computes current route position from schedule time or GPS
  - exported result type:
    - `PilgrimageCurrentLocationResult`
    - `source: 'time-estimated' | 'gps'`
- `features/@app-core/features/route/helpers/pilgrimageRouteStatus.helpers.ts`
- `features/@app-core/features/route/helpers/pilgrimageDaySchedule.helpers.ts`
- `features/@app-core/features/home/helpers/pilgrimageWeatherCard.helpers.ts`
- `features/@app-core/features/news/helpers/pilgrimageNewsCard.helpers.ts`

### Prayer screen

Local static tile definitions in [`features/@app-core/features/prayer/helpers/pilgrimagePrayer.helpers.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/features/prayer/helpers/pilgrimagePrayer.helpers.ts):

- `PrayerTileId = 'hymnal' | 'readings' | 'prayer-book' | 'breviary'`
- `PrayerTileDefinition`
- `PRAYER_TILES`

### Mass readings

Remote source: `niedzielaApi`

- parses HTML into structured readings
- maps reading reference strings into Biblia API coordinates through
  [`features/@app-core/utils/massReadingReference.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/utils/massReadingReference.ts)

Important type:

```ts
type ParsedMassReadingReference = {
  book: string;
  chapter: number;
  verses: string;
  label: string;
};
```

### Bible text

Remote source: `bibliaApi`

- RTK Query wrapper around `https://www.biblia.info.pl/api`
- used for chapter / verse text retrieval

### Breviary

Remote source: `brewiarzApi`

- fetches raw text/HTML-like source
- decodes ISO-8859-2
- strips markup
- groups content into logical sections and optional variants

## 7. API contracts

### `bibliaApi`

File: [`features/@app-core/services/bibliaApi.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/services/bibliaApi.ts)

Main exported transport types:

- `BibleTranslation = 'bt' | string`
- `BibliaTranslation`
- `BibliaBook`
- `BibliaVerse`
- `BibliaChapterResponse`
- `BibliaBookWithPart`
- `BibliaTranslationInfo`
- `BibliaVersion`
- `GetChapterArgs`
- `GetVersesArgs`

Hooks:

- `useGetBibleInfoQuery`
- `useGetChapterQuery`
- `useGetVersesQuery`
- `useGetVersionQuery`

### `niedzielaApi`

File: [`features/@app-core/services/niedzielaApi.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/services/niedzielaApi.ts)

Transport types:

```ts
type NiedzielaReading = {
  id: string;
  label: string;
  reference: string;
  title: string;
  introduction?: string;
  body: string;
};

type NiedzielaDailyReadings = {
  date: string;
  season?: string;
  celebration?: string;
  sourceUrl: string;
  readings: NiedzielaReading[];
};
```

Hook:

- `useGetDailyReadingsQuery`

### `brewiarzApi`

File: [`features/@app-core/services/brewiarzApi.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/services/brewiarzApi.ts)

Transport/domain-ish types:

```ts
type BreviaryOfficeId =
  | 'godzina-czytan'
  | 'jutrznia'
  | 'modlitwa-przedpoludniowa'
  | 'modlitwa-poludniowa'
  | 'modlitwa-popoludniowa'
  | 'nieszpory'
  | 'kompleta';

type BreviarySection = {
  id: string;
  title: string;
  body: string;
  variants?: BreviarySectionVariant[];
};

type BreviarySectionVariant = {
  id: string;
  label: string;
  body: string;
};

type BreviaryOffice = {
  date: string;
  liturgicalDay?: string;
  psalterWeek?: string;
  season?: string;
  office: BreviaryOfficeId;
  officeLabel: string;
  sourceUrl: string;
  sections: BreviarySection[];
};
```

Hook:

- `useGetBreviaryOfficeQuery`

## 8. State management

Store file: [`features/@app-core/store/store.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/store/store.ts)

The Redux store contains only RTK Query reducers:

- `bibliaApi.reducer`
- `brewiarzApi.reducer`
- `niedzielaApi.reducer`

There are no classic slices yet.

Important exported app-level types:

```ts
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
```

## 9. Context + device integration

Location is not kept in Redux.

[`features/@app-core/hooks/useUserLocation.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/hooks/useUserLocation.ts) provides context:

```ts
type UserLocationValue = {
  isLoading: boolean;
  currentLocation: LocationObjectCoords | null;
  hasPermission: boolean;
};
```

Supporting hook:

- [`features/@app-core/hooks/useGpsPermission.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/hooks/useGpsPermission.ts)

Pattern:

- permission resolved first
- then `watchPositionAsync`
- consumers call `useUserLocation()`

## 10. UI package

[`packages/@app-ui`](/Users/mlenqe/Praca/private_projects/my-expo-app/packages/@app-ui) is very small.

Exports:

- `pilgrimageRouteTheme`
- icon set from `components/icons/PilgrimageIcons.tsx`

Theme is a frozen `as const` object with:

- `colors`
- `spacing`
- `radii`
- `typography.fontFamily = 'Manrope'`

This is not a full design system runtime, just a typed constants object.

## 11. Public exports that matter

[`features/@app-core/index.ts`](/Users/mlenqe/Praca/private_projects/my-expo-app/features/@app-core/index.ts) re-exports a subset of app-core:

- route constants/helpers
- route components/screens
- selected news/home/prayer/route screens
- current location utility

This file is effectively the public surface of `@app/core`, although most imports inside the repo still use relative paths directly.

## 12. Structure map

```text
App.tsx
features/
  @app-core/
    components/        # layout + shared screen-level UI
    constants/         # main domain model and seeded data
    features/
      breviary/
      home/
      mass-readings/
      news/
      prayer/
      route/
    hooks/             # GPS permission + location context
    routes/            # local-state navigation
    services/          # RTK Query APIs
    store/             # configureStore
    utils/             # domain parsing / route math
packages/
  @app-ui/
    components/icons/
    theme/
```

## 13. Things Claude should keep in mind

- The codebase separates three categories of types:
  - domain model types in `constants/pilgrimageRoute.ts`
  - transport/API response types in `services/*`
  - local component prop types inside feature/component files
- There is no centralized `types/` folder.
- Navigation and location are local/context state, not Redux slices.
- The current architecture is feature-folder oriented, but the real source of truth is still one large static file.
- Many UI screens depend on helper functions rather than selectors/hooks abstractions.
- Because `tsconfig` has no path aliases, refactors usually require relative import updates.

## 14. Fast analysis prompts for Claude

Suggested prompt seed:

> Przeanalizuj repo pod kątem architektury TypeScript. Skup się na:
> 1. granicach między typami domenowymi, transportowymi i UI props,
> 2. miejscach, gdzie `pilgrimageRoute.ts` jest zbyt dużym source of truth,
> 3. możliwościach wydzielenia lepszych modułów typów,
> 4. ryzykach wynikających z lokalnego state navigation zamiast routera,
> 5. spójności typów między helperami, screenami i RTK Query.

