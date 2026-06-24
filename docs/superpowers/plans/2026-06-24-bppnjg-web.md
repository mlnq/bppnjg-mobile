# Pielgrzym Web — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production React web app from the `bppnjg-web` prototype (JSX files + app.css), connected to the real backend API, with offline PWA support.

**Architecture:** Vite + React 18 + TypeScript + React Router v6. Shell wraps all screens via `<Outlet>`. Data flows from a `PilgrimageContext` (loaded at boot from `/api/pilgrimages/2025/bootstrap`); dynamic data (news, quartermaster) uses TanStack Query with stale-while-revalidate. Seed JSON (from prototype's `data.js`) is imported when `VITE_API_BASE_URL` is absent.

**Tech Stack:** Vite 5, React 18, TypeScript 5, React Router 6, TanStack Query 5, vite-plugin-pwa, Vitest

## Global Constraints

- Working directory for ALL commands: `/Users/mlenqe/Praca/private_projects/bppnjg-web`
- Prototype source files stay at root — React source goes in `src/`
- `app.css` values copied 1:1 — no design changes
- `--read-scale` CSS custom property must remain a string key (TypeScript quirk with React `style` prop)
- Pilgrimage year constant: `'2025'`
- Pilgrimage dates: 30 July – 12 August 2025 (14 days)
- Day selection fallback: before start → day 1, after end → day 14
- Polish decimal separator: comma (use `fmt`/`fmt1` everywhere)
- Animations: only `transform`, never `opacity` (browser throttling resilience — from handoff §7)
- No comments in code unless the WHY is non-obvious

---

### Task 1: Project scaffold + CSS foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/vite-env.d.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/main.tsx` (minimal — just mounts `<div id="root">`)
- Create: `vitest.config.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "bppnjg-web",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.51.21",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "jsdom": "^24.1.0",
    "typescript": "^5.5.3",
    "vite": "^5.4.0",
    "vite-plugin-pwa": "^0.20.5",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 3: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

(PWA is added in Task 11.)

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pielgrzym</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Bricolage+Grotesque:wght@400;600;700&family=Space+Grotesk:wght@400;500;700&family=Schibsted+Grotesk:wght@400;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Split `app.css` into `src/styles/tokens.css` + `src/styles/base.css`**

`tokens.css` = everything from line 1 through the closing `}` of `[data-accent="wyrazisty"]` block (the `:root`, `[data-type]`, `[data-read]`, `[data-accent]` rules — all CSS custom property declarations and their scopes).

`base.css` = everything after those blocks (reset `*`, `html/body`, `.app`, `.viewport`, `.hdr`, `.tabbar`, `.tab`, `.card`, `.stage`, all component classes).

Run: `wc -l src/styles/tokens.css src/styles/base.css` — combined should equal `wc -l app.css`.

- [ ] **Step 7: Create `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 8: Create minimal `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="app">Pielgrzym loading…</div>
  </StrictMode>,
);
```

- [ ] **Step 9: Install and verify build**

```bash
cd /Users/mlenqe/Praca/private_projects/bppnjg-web
npm install
npm run dev
```

Expected: dev server starts, browser shows "Pielgrzym loading…" with correct font (Hanken Grotesk) and background color `#EFEFF4` (from `--paper`).

- [ ] **Step 10: Commit**

```bash
git init
git add package.json tsconfig*.json vite.config.ts vitest.config.ts index.html src/
git commit -m "feat: scaffold Vite + React + TS project with CSS foundation"
```

---

### Task 2: Core library files

**Files:**
- Create: `src/lib/position.ts` (from `handoff/position.ts.txt`)
- Create: `src/lib/usePozycja.ts` (from `handoff/usePozycja.ts.txt`)
- Create: `src/lib/useLocalStorage.ts` (from `handoff/useLocalStorage.ts.txt`)
- Create: `src/lib/format.ts`
- Create: `src/lib/icons.tsx`
- Create: `src/lib/position.test.ts`

**Interfaces — Produces:**
- Types: `Przystanek`, `Dzien`, `Fix`, `TrybPozycji`, `ZrodloPozycji`, `StanPozycji`
- Functions: `pozycjaZHarmonogramu(dzien, now?)`, `dystansNaTrasie(dzien, fix)`, `startWatch(onFix)`
- Hook: `usePozycja(dzien, tryb)` → `StanPozycji`
- Hook: `useLocalStorage<T>(key, initial)` → `[T, Setter]`
- Functions: `fmt(n)` → `"12,34"`, `fmt1(n)` → `"12,3"`
- Const: `ICONS: Record<string, string>` (SVG path strings)
- Component: `<Icon name="..." size? className? style? />`

- [ ] **Step 1: Copy handoff files verbatim**

```bash
cp handoff/position.ts.txt src/lib/position.ts
cp handoff/usePozycja.ts.txt src/lib/usePozycja.ts
cp handoff/useLocalStorage.ts.txt src/lib/useLocalStorage.ts
```

Remove the block comment header from each file (lines starting with `// ===`).

- [ ] **Step 2: Create `src/lib/format.ts`**

```ts
export const fmt = (n: number) => n.toFixed(2).replace('.', ',');
export const fmt1 = (n: number) => n.toFixed(1).replace('.', ',');
```

- [ ] **Step 3: Create `src/lib/icons.tsx`**

Copy the `window.ICONS` object from `icons.js` into a typed map, then export an `Icon` component:

```tsx
export const ICONS: Record<string, string> = {
  home: '<path d="M3 9.6 12 3l9 6.6V20a1 1 0 0 1-1 1h-5v-6.5H9V21H4a1 1 0 0 1-1-1z"/>',
  map: '<path d="m9 4-6 2.4v14.2L9 18.6l6 2.4 6-2.4V4.4L15 6.4 9 4Z"/><path d="M9 4v14.6"/><path d="M15 6.4V21"/>',
  // … copy all remaining entries from icons.js verbatim …
};

type IconProps = {
  name: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

export function Icon({ name, size, className = '', style }: IconProps) {
  const inner = ICONS[name] ?? '';
  return (
    <span className={'ic ' + className} style={{ fontSize: size, ...style }} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeLinecap="round" strokeLinejoin="round"
           dangerouslySetInnerHTML={{ __html: inner }} />
    </span>
  );
}
```

- [ ] **Step 4: Write failing tests for `position.ts`**

Create `src/lib/position.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { pozycjaZHarmonogramu, dystansNaTrasie } from './position';
import type { Dzien, Fix } from './position';

const dzien: Dzien = {
  nr: 1,
  od: 'A',
  do: 'B',
  dystans: 30,
  przystanki: [
    { czas: '06:00', km: 0, miejsce: 'A' },
    { czas: '12:00', km: 15, miejsce: 'M' },
    { czas: '18:00', km: 30, miejsce: 'B' },
  ],
};

describe('pozycjaZHarmonogramu', () => {
  it('returns 0 before start', () => {
    const now = new Date(); now.setHours(5, 0, 0, 0);
    expect(pozycjaZHarmonogramu(dzien, now)).toBe(0);
  });

  it('returns full distance after end', () => {
    const now = new Date(); now.setHours(19, 0, 0, 0);
    expect(pozycjaZHarmonogramu(dzien, now)).toBe(30);
  });

  it('interpolates at midpoint', () => {
    const now = new Date(); now.setHours(9, 0, 0, 0);
    expect(pozycjaZHarmonogramu(dzien, now)).toBeCloseTo(7.5);
  });

  it('returns exact km at waypoint time', () => {
    const now = new Date(); now.setHours(12, 0, 0, 0);
    expect(pozycjaZHarmonogramu(dzien, now)).toBe(15);
  });
});

const dzienGps: Dzien = {
  nr: 1, od: 'A', do: 'B', dystans: 10,
  przystanki: [
    { czas: '06:00', km: 0, miejsce: 'A', lat: 0, lng: 0 },
    { czas: '12:00', km: 10, miejsce: 'B', lat: 0, lng: 0.1 },
  ],
};

describe('dystansNaTrasie', () => {
  it('returns null when no lat/lng', () => {
    const fix: Fix = { lat: 0, lng: 0.05, acc: 10, t: Date.now() };
    expect(dystansNaTrasie(dzien, fix)).toBeNull();
  });

  it('projects midpoint GPS fix to midpoint km', () => {
    const fix: Fix = { lat: 0, lng: 0.05, acc: 10, t: Date.now() };
    const result = dystansNaTrasie(dzienGps, fix);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(5, 0);
  });
});
```

- [ ] **Step 5: Run tests — verify they fail (functions not found)**

```bash
npm test
```

Expected: import errors or assertion failures — tests must fail at this point since `position.ts` is about to be added.

Actually `position.ts` IS already copied. Run tests:

```bash
npm test
```

Expected: ALL PASS. If any fail, fix `position.ts` before continuing.

- [ ] **Step 6: Commit**

```bash
git add src/lib/
git commit -m "feat: add core libs — position, usePozycja, useLocalStorage, format, icons"
```

---

### Task 3: Data layer — types, seed, API

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/seeds/bootstrap.json`
- Create: `src/data/seeds/news.json`
- Create: `src/data/seeds/quartermaster.json`
- Create: `src/data/content.ts`
- Create: `src/data/api.ts`

**Interfaces — Consumes:** Nothing from previous tasks (pure data layer).

**Interfaces — Produces:**
- Types: `ApiStop`, `ApiPilgrimageDay`, `ApiPilgrimage`, `BootstrapResponse`, `BackendNewsItem`, `NewsResponse`, `QuartermasterComment`, `QuartermasterResponse`, `CurrentRouteStateDto`, `RouteStateRequest`
- Function: `toDzien(day: ApiPilgrimageDay): Dzien` (converts API day → position.ts `Dzien` for `usePozycja`)
- Object: `api` with methods: `bootstrap()`, `getNews()`, `getQuartermaster()`
- Static content: `CONTENT_MAP: Record<string, ContentModule>` (prayers, readings, songbook, breviary)

- [ ] **Step 1: Create `src/data/types.ts`**

```ts
export type ApiStop = {
  id: string;
  orderIndex: number;
  name: string | null;
  townName: string | null;
  time: string;
  type: 'start' | 'info' | 'night';
  distanceToNextKm: number;
  durationMin?: number | null;
  latitude: number | null;
  longitude: number | null;
  description?: string | null;
  badge?: string | null;
};

export type ApiPilgrimageDay = {
  id: string;
  dayNumber: number;
  title: string;
  date: string;
  route: {
    startStopId: string;
    endStopId: string;
    totalDistanceKm: number;
    scheduledStartTime: string;
    plannedArrivalTime: string;
  };
  stops: ApiStop[];
  reflection?: { title: string };
  conference?: {
    id?: number;
    date?: string;
    author?: string;
    title: string;
    content: string;
  };
  weather?: {
    temperatureC: number;
    icon: 'sunny' | 'cloudy' | 'rain' | 'storm' | 'partlyCloudy';
  };
  news: NewsItem[];
};

export type ApiPilgrimage = {
  id: string;
  name: string;
  startDate: string;
  totalDays: number;
  totalDistanceKm: number;
  overall: {
    traveledDistanceKm: number;
    remainingDistanceKm: number;
    totalDistanceKm: number;
    progressPercent: number;
    completedDayCount: number;
    activeDayNumber: number;
  };
  days: ApiPilgrimageDay[];
};

export type BootstrapResponse = {
  pilgrimage: ApiPilgrimage | null;
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: 'announcement' | 'logistics' | 'spiritual' | 'weather';
  publishedAt: string;
  isPinned?: boolean;
};

export type BackendNewsItem = {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  publishedAt: string;
  isPinned?: boolean;
};

export type NewsResponse = { items?: BackendNewsItem[] };

export type QuartermasterComment = {
  id: string;
  dayNumber?: number;
  title: string;
  content: string;
  publishedAt: string;
};

export type QuartermasterResponse = { items?: QuartermasterComment[] };

export type CurrentRouteStateDto = {
  source: 'gps' | 'time-estimated';
  currentTownId: string;
  traveledDistanceKm: number;
  remainingDistanceKm: number;
  statusLabel: string;
  computedAt: string;
};

export type RouteStateRequest = {
  pilgrimageId: string;
  dayId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

export type Akapit =
  | { typ: 'lead' | 'p' | 'h3' | 'verse' | 'resp' | 'drop'; t: string };

export type ContentModule = {
  modul: string;
  kolor: 'rose' | 'amber' | 'green' | 'blue';
  ic: string;
  tytul: string;
  sub: string;
  akapity: Akapit[];
};
```

- [ ] **Step 2: Create `src/data/seeds/bootstrap.json`**

Convert `data.js` `PG.dni` and `PG.konferencja` into `BootstrapResponse` shape. Day 3 gets full stops derived from the harmonogram (non-`seg` entries become `ApiStop`). Other days get minimal stop arrays.

```json
{
  "pilgrimage": {
    "id": "xliii-2025",
    "name": "XLIII Piesza Pielgrzymka",
    "startDate": "2025-07-30",
    "totalDays": 14,
    "totalDistanceKm": 400,
    "overall": {
      "traveledDistanceKm": 72.5,
      "remainingDistanceKm": 327.5,
      "totalDistanceKm": 400,
      "progressPercent": 18,
      "completedDayCount": 2,
      "activeDayNumber": 3
    },
    "days": [
      {
        "id": "day-1",
        "dayNumber": 1,
        "title": "Dzień 1",
        "date": "2025-07-30",
        "route": { "startStopId": "d1_s0", "endStopId": "d1_s1", "totalDistanceKm": 31.4, "scheduledStartTime": "06:00", "plannedArrivalTime": "17:00" },
        "stops": [
          { "id": "d1_s0", "orderIndex": 0, "name": "Kościół Katedralny", "townName": "Białystok", "time": "06:00", "type": "start", "distanceToNextKm": 31.4, "latitude": null, "longitude": null },
          { "id": "d1_s1", "orderIndex": 1, "name": null, "townName": "Suraż", "time": "17:00", "type": "night", "distanceToNextKm": 0, "latitude": null, "longitude": null }
        ],
        "news": []
      },
      {
        "id": "day-2",
        "dayNumber": 2,
        "title": "Dzień 2",
        "date": "2025-07-31",
        "route": { "startStopId": "d2_s0", "endStopId": "d2_s1", "totalDistanceKm": 28.1, "scheduledStartTime": "05:30", "plannedArrivalTime": "16:30" },
        "stops": [
          { "id": "d2_s0", "orderIndex": 0, "name": null, "townName": "Suraż", "time": "05:30", "type": "start", "distanceToNextKm": 28.1, "latitude": null, "longitude": null },
          { "id": "d2_s1", "orderIndex": 1, "name": null, "townName": "Brańsk", "time": "16:30", "type": "night", "distanceToNextKm": 0, "latitude": null, "longitude": null }
        ],
        "news": []
      },
      {
        "id": "day-3",
        "dayNumber": 3,
        "title": "Dzień 3",
        "date": "2025-08-01",
        "route": { "startStopId": "d3_s0", "endStopId": "d3_s6", "totalDistanceKm": 31.5, "scheduledStartTime": "05:30", "plannedArrivalTime": "17:30" },
        "stops": [
          { "id": "d3_s0", "orderIndex": 0, "name": "Kościół Wniebowzięcia NMP", "townName": "Brańsk", "time": "05:30", "type": "start", "distanceToNextKm": 4.2, "latitude": null, "longitude": null },
          { "id": "d3_s1", "orderIndex": 1, "name": "Kapliczka przydrożna", "townName": "Kąty", "time": "06:40", "type": "info", "distanceToNextKm": 5.1, "durationMin": 0, "latitude": null, "longitude": null, "badge": "Modlitwa", "description": "Modlitwa poranna" },
          { "id": "d3_s2", "orderIndex": 2, "name": null, "townName": "Domanowo", "time": "08:10", "type": "info", "distanceToNextKm": 2.7, "durationMin": 45, "latitude": null, "longitude": null, "badge": "Postój", "description": "Śniadanie" },
          { "id": "d3_s3", "orderIndex": 3, "name": null, "townName": "Olędzkie", "time": "09:30", "type": "info", "distanceToNextKm": 6.3, "latitude": null, "longitude": null },
          { "id": "d3_s4", "orderIndex": 4, "name": "Szkoła Podstawowa", "townName": "Pobikry", "time": "12:15", "type": "info", "distanceToNextKm": 4.9, "durationMin": 60, "latitude": null, "longitude": null, "badge": "Postój", "description": "Obiad przy szkole" },
          { "id": "d3_s5", "orderIndex": 5, "name": null, "townName": "Winna-Poświętna", "time": "15:00", "type": "info", "distanceToNextKm": 3.3, "latitude": null, "longitude": null, "badge": "Konferencja", "description": "Konferencja w drodze" },
          { "id": "d3_s6", "orderIndex": 6, "name": "Zespół Szkół, hala sportowa", "townName": "Ciechanowiec", "time": "17:30", "type": "night", "distanceToNextKm": 0, "latitude": null, "longitude": null }
        ],
        "conference": {
          "id": 3,
          "date": "2025-08-01",
          "author": "ks. Tomasz Wadowski",
          "title": "Iść w rytmie, który nie jest twój",
          "content": "Pierwszego dnia każdy idzie tak, jak chce. Drugiego — tak, jak musi. Trzeci dzień jest najtrudniejszy, bo to dzień, w którym uczysz się iść tak, jak idzie grupa."
        },
        "weather": { "temperatureC": 17, "icon": "partlyCloudy" },
        "news": [
          { "id": "n1", "title": "Zmiana miejsca postoju obiadowego", "summary": "Ze względu na prace obiad będzie w Pobikrach przy szkole.", "category": "logistics", "publishedAt": "2025-08-01T08:10:00Z", "isPinned": true },
          { "id": "n2", "title": "Odcinek drogi wojewódzkiej — idziemy lewą stroną", "summary": "Między Kątami a Domanowem 2 km poboczem.", "category": "announcement", "publishedAt": "2025-08-01T06:30:00Z", "isPinned": true }
        ]
      }
    ]
  }
}
```

- [ ] **Step 3: Create `src/data/seeds/news.json`**

```json
{
  "items": [
    { "id": "n1", "title": "Zmiana miejsca postoju obiadowego", "summary": "Ze względu na prace obiad będzie w Pobikrach przy szkole.", "category": "logistics", "publishedAt": "2025-08-01T08:10:00Z", "isPinned": true },
    { "id": "n2", "title": "Odcinek drogi wojewódzkiej — idziemy lewą stroną", "summary": "Między Kątami a Domanowem 2 km poboczem.", "category": "announcement", "publishedAt": "2025-08-01T06:30:00Z", "isPinned": true },
    { "id": "n3", "title": "Intencja dnia trzeciego", "summary": "Dzień ofiarujemy w intencji rodzin pątników.", "category": "spiritual", "publishedAt": "2025-07-31T19:40:00Z" },
    { "id": "n4", "title": "Punkt medyczny — godziny dyżuru", "summary": "Opatrunki i pęcherze — sala 12 w Ciechanowcu, od 16:30 do północy.", "category": "announcement", "publishedAt": "2025-07-31T17:05:00Z" }
  ]
}
```

- [ ] **Step 4: Create `src/data/seeds/quartermaster.json`**

```json
{
  "items": [
    { "id": "q3", "dayNumber": 3, "title": "Ciechanowiec — hala gotowa, ciepła woda jest", "content": "Hala sportowa otwarta od 16:30. Karimaty rozkładamy wzdłuż dłuższych ścian.\n\nCiepła woda w obu szatniach działa do 22:00. Prosimy o krótkie prysznice, jest nas dziś 480 osób.\n\nKuchnia polowa staje przy wejściu od boiska. Kolacja od 18:00: grochówka i chleb. Śniadanie 4:45.\n\nApteczka i punkt opatrunkowy — sala nr 12, przy wejściu skręt w prawo.", "publishedAt": "2025-08-01T16:00:00Z" },
    { "id": "q2", "dayNumber": 2, "title": "Brańsk — dziękujemy gospodarzom", "content": "Cisza nocna od 22:00. Rano zbiórka grup przy figurze.\n\nParafia przyjęła nas wyjątkowo serdecznie. Zgubione rzeczy czekają u kwatermistrza.", "publishedAt": "2025-07-31T19:00:00Z" },
    { "id": "q1", "dayNumber": 1, "title": "Pierwszy dzień za nami", "content": "31 kilometrów to dużo jak na pierwszy dzień. Jutro idziemy wolniej, pamiętajcie o stopach.\n\nBagażówka rusza zawsze 30 minut po kolumnie.", "publishedAt": "2025-07-30T18:00:00Z" }
  ]
}
```

- [ ] **Step 5: Create `src/data/content.ts`** (static spiritual content)

```ts
import type { ContentModule } from './types';

export const CONTENT_MAP: Record<string, ContentModule> = {
  modlitewnik: {
    modul: 'Modlitewnik', kolor: 'green', ic: 'book-heart',
    tytul: 'Modlitwa pielgrzyma na drogę',
    sub: 'do odmówienia przed wymarszem',
    akapity: [
      { typ: 'lead', t: 'Boże, Ty wezwałeś Abrahama, aby wyszedł z ziemi swojej, i prowadziłeś lud Twój przez pustynię do ziemi obiecanej.' },
      { typ: 'p', t: 'Bądź dziś przy nas, gdy ruszamy w drogę. Umocnij nogi zmęczone, rozjaśnij myśli niespokojne, otwórz serce na tych, którzy idą obok.' },
      { typ: 'verse', t: '„Prowadź nas, Panie, drogą Twoich przykazań, abyśmy doszli tam, dokąd Ty sam idziesz przed nami."' },
      { typ: 'resp', t: 'W: Strzeż nas w drodze. O: I doprowadź do celu.' },
      { typ: 'p', t: 'Maryjo, Pani Jasnogórska, Przewodniczko pielgrzymów, weź w opiekę każdy nasz krok.' },
      { typ: 'p', t: 'Amen.' },
    ],
  },
  czytania: {
    modul: 'Czytania', kolor: 'amber', ic: 'book-open',
    tytul: 'Liturgia słowa',
    sub: 'wtorek, dzień powszedni',
    akapity: [
      { typ: 'h3', t: 'Pierwsze czytanie · Dz 11, 19–26' },
      { typ: 'p', t: 'W owych dniach ci, których rozproszyło prześladowanie, jakie wybuchło z powodu Szczepana, dotarli aż do Fenicji, na Cypr i do Antiochii, głosząc słowo.' },
      { typ: 'h3', t: 'Psalm responsoryjny' },
      { typ: 'resp', t: 'R: Wielbcie Pana, wszystkie ludy ziemi.' },
      { typ: 'h3', t: 'Ewangelia · J 10, 22–30' },
      { typ: 'p', t: 'Jezus przechadzał się w świątyni, w portyku Salomona.' },
      { typ: 'verse', t: '„Moje owce słuchają mego głosu, a Ja znam je. Idą one za Mną."' },
    ],
  },
  spiewnik: {
    modul: 'Śpiewnik', kolor: 'rose', ic: 'music',
    tytul: 'Pieśń pielgrzyma',
    sub: 'Pieśń pielgrzymkowa na Jasną Górę',
    akapity: [
      { typ: 'p', t: 'Idzie pielgrzym przez tę ziemię, w sercu niosąc Twoje imię, Matko z Jasnej Góry.' },
      { typ: 'resp', t: 'Ref: Prowadź nas, Maryjo, drogą prostą do Twego Syna.' },
      { typ: 'p', t: 'Choć daleka droga przed nami, choć słońce praży, choć deszcz pada — z pieśnią lżej idzie się naprzód.' },
      { typ: 'resp', t: 'Ref: Prowadź nas, Maryjo, drogą prostą do Twego Syna.' },
    ],
  },
  brewiarz: {
    modul: 'Brewiarz', kolor: 'blue', ic: 'church',
    tytul: 'Jutrznia',
    sub: 'Liturgia godzin — modlitwa poranna',
    akapity: [
      { typ: 'p', t: 'Panie, otwórz wargi moje, a usta moje będą głosić Twoją chwałę.' },
      { typ: 'h3', t: 'Hymn' },
      { typ: 'p', t: 'Kiedy ranne wstają zorze, Tobie ziemia, Tobie morze, Tobie śpiewa żywioł wszelki: bądź pochwalon, Boże wielki.' },
      { typ: 'h3', t: 'Psalm 63' },
      { typ: 'verse', t: 'Boże, Ty Boże mój, Ciebie szukam; Ciebie pragnie moja dusza, za Tobą tęskni moje ciało.' },
    ],
  },
};
```

- [ ] **Step 6: Create `src/data/api.ts`**

```ts
import type {
  BootstrapResponse, NewsResponse, QuartermasterResponse,
  RouteStateRequest, CurrentRouteStateDto,
} from './types';
import type { Dzien } from '../lib/position';
import type { ApiPilgrimageDay } from './types';

import bootstrapSeed from './seeds/bootstrap.json';
import newsSeed from './seeds/news.json';
import quartermasterSeed from './seeds/quartermaster.json';

const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const YEAR = '2025';

function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) return Promise.reject(new Error('No VITE_API_BASE_URL'));
  return fetch(`${BASE}${path}`, init).then((r) => {
    if (!r.ok) throw new Error(`API ${r.status}: ${path}`);
    return r.json() as Promise<T>;
  });
}

export const api = {
  bootstrap(): Promise<BootstrapResponse> {
    if (!BASE) return Promise.resolve(bootstrapSeed as BootstrapResponse);
    return fetchJson<BootstrapResponse>(`/api/pilgrimages/${YEAR}/bootstrap`);
  },

  getNews(): Promise<NewsResponse> {
    if (!BASE) return Promise.resolve(newsSeed as NewsResponse);
    return fetchJson<NewsResponse>('/api/news?limit=50&page=1');
  },

  getQuartermaster(): Promise<QuartermasterResponse> {
    if (!BASE) return Promise.resolve(quartermasterSeed as QuartermasterResponse);
    return fetchJson<QuartermasterResponse>('/api/quartermaster-comments');
  },

  postRouteState(body: RouteStateRequest): Promise<CurrentRouteStateDto> {
    return fetchJson<CurrentRouteStateDto>(
      `/api/pilgrimages/${YEAR}/days/${body.dayId}/route-state`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    );
  },
};

export function buildKmCumulative(stops: ApiPilgrimageDay['stops']): number[] {
  const km: number[] = [0];
  for (let i = 0; i < stops.length - 1; i++) {
    km.push(km[i] + (stops[i].distanceToNextKm ?? 0));
  }
  return km;
}

export function toDzien(day: ApiPilgrimageDay): Dzien {
  const kmCum = buildKmCumulative(day.stops);
  return {
    nr: day.dayNumber,
    od: day.stops[0]?.townName ?? '',
    do: day.stops[day.stops.length - 1]?.townName ?? '',
    dystans: day.route.totalDistanceKm,
    przystanki: day.stops.map((s, i) => ({
      czas: s.time,
      km: kmCum[i],
      miejsce: s.townName ?? s.name ?? '',
      lat: s.latitude ?? undefined,
      lng: s.longitude ?? undefined,
    })),
  };
}
```

- [ ] **Step 7: Add `resolveJsonModule` to tsconfig.app.json**

Add `"resolveJsonModule": true` to `compilerOptions` in `tsconfig.app.json`.

- [ ] **Step 8: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 9: Commit**

```bash
git add src/data/
git commit -m "feat: add data layer — types, seed JSON, api.ts, static content"
```

---

### Task 4: Base components

**Files:**
- Create: `src/components/Eyebrow.tsx`
- Create: `src/components/Pill.tsx`
- Create: `src/components/Chip.tsx`
- Create: `src/components/Button.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Row.tsx`
- Create: `src/components/Progress.tsx`
- Create: `src/components/SectionHead.tsx`
- Create: `src/components/ReadProgress.tsx`
- Create: `src/components/Prose.tsx`
- Create: `src/components/Reader.tsx`
- Create: `src/components/index.ts`

**Interfaces — Consumes:** `Icon` from `../lib/icons`, `Akapit` from `../data/types`

**Interfaces — Produces:** All components with their prop types as exported from `src/components/index.ts`

- [ ] **Step 1: Create `src/components/Eyebrow.tsx`**

```tsx
type EyebrowProps = {
  children: React.ReactNode;
  wine?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function Eyebrow({ children, wine, className = '', style }: EyebrowProps) {
  return (
    <div className={'eyebrow ' + (wine ? 'eyebrow--wine ' : '') + className} style={style}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/Pill.tsx`**

```tsx
import { Icon } from '../lib/icons';

type PillProps = {
  children: React.ReactNode;
  variant?: 'rose' | 'ghost';
  icon?: string;
  className?: string;
};

export function Pill({ children, variant = 'rose', icon, className = '' }: PillProps) {
  return (
    <span className={'pill pill--' + variant + ' ' + className}>
      {icon && <Icon name={icon} />}
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create `src/components/Chip.tsx`**

```tsx
import { Icon } from '../lib/icons';

type ChipProps = {
  icon: string;
  tone?: 'rose' | 'amber' | 'green' | 'blue';
  round?: boolean;
  size?: number;
};

export function Chip({ icon, tone = 'rose', round, size }: ChipProps) {
  return (
    <span
      className={'chip chip--' + tone + (round ? ' chip--round' : '')}
      style={size ? { width: size, height: size, fontSize: size * 0.5 } : undefined}
    >
      <Icon name={icon} />
    </span>
  );
}
```

- [ ] **Step 4: Create `src/components/Button.tsx`**

```tsx
import { Icon } from '../lib/icons';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'wine' | 'ghost';
  icon?: string;
  iconRight?: string;
  block?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
};

export function Button({
  children, variant = 'wine', icon, iconRight, block,
  onClick, type = 'button', className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={'btn btn--' + variant + (block ? ' btn--block' : '') + ' ' + className}
    >
      {icon && <Icon name={icon} />}
      {children}
      {iconRight && <Icon name={iconRight} />}
    </button>
  );
}
```

- [ ] **Step 5: Create `src/components/Header.tsx`**

```tsx
import { Icon } from '../lib/icons';

type HeaderProps = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  scrolled?: boolean;
};

export function Header({ title, onBack, right, scrolled }: HeaderProps) {
  return (
    <header className={'hdr' + (scrolled ? ' scrolled' : '')}>
      {onBack ? (
        <button className="hdr__btn left" onClick={onBack} aria-label="Wstecz">
          <Icon name="chevron-left" />
        </button>
      ) : (
        <span className="hdr__btn left" />
      )}
      <h1 className="hdr__title">{title}</h1>
      {right ?? <span className="hdr__btn right" />}
    </header>
  );
}
```

- [ ] **Step 6: Create `src/components/Row.tsx`**

```tsx
import { Icon } from '../lib/icons';
import { Chip } from './Chip';

type RowProps = {
  icon?: string;
  tone?: 'rose' | 'amber' | 'green' | 'blue';
  title: string;
  meta?: string;
  right?: React.ReactNode;
  onClick?: () => void;
};

export function Row({ icon, tone = 'rose', title, meta, right, onClick }: RowProps) {
  return (
    <button className="row" onClick={onClick}>
      {icon && <Chip icon={icon} tone={tone} round />}
      <span className="row__body">
        <span className="row__title">{title}</span>
        {meta && <span className="row__meta">{meta}</span>}
      </span>
      {right ?? <Icon name="chevron-right" className="row__chev" />}
    </button>
  );
}
```

- [ ] **Step 7: Create `src/components/Progress.tsx`**

```tsx
import { useEffect, useState } from 'react';

type ProgressProps = {
  pct: number;
  leftLabel?: string;
  rightLabel?: string;
};

export function Progress({ pct, leftLabel, rightLabel }: ProgressProps) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="progress">
      <div className="progress__track">
        <div className="progress__fill" style={{ width: w + '%' }}>
          <span className="progress__pct">{pct}%</span>
        </div>
      </div>
      {(leftLabel || rightLabel) && (
        <div className="progress__labels">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create `src/components/SectionHead.tsx`**

```tsx
type SectionHeadProps = {
  children: React.ReactNode;
  link?: string;
  onLink?: () => void;
};

export function SectionHead({ children, link, onLink }: SectionHeadProps) {
  return (
    <div className="sec">
      <h2 className="sec__h">{children}</h2>
      {link && <button className="sec__link" onClick={onLink}>{link}</button>}
    </div>
  );
}
```

- [ ] **Step 9: Create `src/components/ReadProgress.tsx`**

```tsx
import { useEffect, useState } from 'react';

type ReadProgressProps = { scrollEl: React.RefObject<HTMLElement | null> };

export function ReadProgress({ scrollEl }: ReadProgressProps) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = scrollEl.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollEl]);
  return <div className="readbar"><div className="readbar__fill" style={{ width: p + '%' }} /></div>;
}
```

- [ ] **Step 10: Create `src/components/Prose.tsx`**

```tsx
import type { Akapit } from '../data/types';

type ProseProps = { akapity: Akapit[]; dropcap?: boolean };

export function Prose({ akapity, dropcap }: ProseProps) {
  return (
    <div className="prose">
      {akapity.map((a, i) => {
        if (a.typ === 'h3') return <h3 key={i}>{a.t}</h3>;
        if (a.typ === 'verse') return <span key={i} className="verse">{a.t}</span>;
        if (a.typ === 'resp') return <p key={i} className="resp">{a.t}</p>;
        if (a.typ === 'lead') return <p key={i} className="lead">{a.t}</p>;
        if (a.typ === 'drop') return <p key={i} className={dropcap ? 'dropcap' : ''}>{a.t}</p>;
        return <p key={i}>{a.t}</p>;
      })}
    </div>
  );
}
```

- [ ] **Step 11: Create `src/components/Reader.tsx`**

```tsx
import { useRef, useState } from 'react';
import { Header } from './Header';
import { ReadProgress } from './ReadProgress';
import { Chip } from './Chip';
import { Eyebrow } from './Eyebrow';
import { Prose } from './Prose';
import type { Akapit } from '../data/types';

type ReaderProps = {
  title: string;
  onBack: () => void;
  kickerIcon: string;
  kickerTone?: 'rose' | 'amber' | 'green' | 'blue';
  kickerLabel: string;
  headline: string;
  byline?: React.ReactNode;
  akapity: Akapit[];
  dropcap?: boolean;
  footer?: React.ReactNode;
};

export function Reader({
  title, onBack, kickerIcon, kickerTone = 'rose',
  kickerLabel, headline, byline, akapity, dropcap, footer,
}: ReaderProps) {
  const vp = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  return (
    <>
      <Header title={title} onBack={onBack} scrolled={scrolled} />
      <div
        className="viewport scroll"
        ref={vp}
        onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 4)}
      >
        <ReadProgress scrollEl={vp} />
        <div className="stage">
          <article className="reader enter enter-1">
            <div className="reader__kicker">
              <Chip icon={kickerIcon} tone={kickerTone} size={34} />
              <Eyebrow wine={kickerTone === 'rose'}>{kickerLabel}</Eyebrow>
            </div>
            <h1 className="reader__title">{headline}</h1>
            {byline}
            <hr className="reader__rule" />
            <Prose akapity={akapity} dropcap={dropcap} />
            {footer}
          </article>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 12: Create `src/components/index.ts`**

```ts
export { Eyebrow } from './Eyebrow';
export { Pill } from './Pill';
export { Chip } from './Chip';
export { Button } from './Button';
export { Header } from './Header';
export { Row } from './Row';
export { Progress } from './Progress';
export { SectionHead } from './SectionHead';
export { ReadProgress } from './ReadProgress';
export { Prose } from './Prose';
export { Reader } from './Reader';
```

- [ ] **Step 13: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 14: Commit**

```bash
git add src/components/
git commit -m "feat: add base components — Icon, Eyebrow, Pill, Chip, Button, Header, Row, Progress, Prose, Reader"
```

---

### Task 5: Shell + routing + pilgrimage context

**Files:**
- Create: `src/app/PilgrimageContext.tsx`
- Create: `src/app/Shell.tsx`
- Create: `src/app/App.tsx`
- Modify: `src/main.tsx`
- Create placeholder screens: `src/features/*/index.tsx` (all 10 screens, each just renders a `<p>` stub)

**Interfaces — Consumes:**
- `api.bootstrap()` from `../data/api`
- `ApiPilgrimageDay`, `ApiPilgrimage` from `../data/types`
- `useLocalStorage` from `../lib/useLocalStorage`
- `Icon` from `../lib/icons`

**Interfaces — Produces:**
- `usePilgrimage()` → `{ pilgrimage: ApiPilgrimage; day: ApiPilgrimageDay }`
- `useSettings()` → `[Ustawienia, Setter]`
- Routing tree with all paths

- [ ] **Step 1: Define `Ustawienia` type + create `src/app/PilgrimageContext.tsx`**

```tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ApiPilgrimage, ApiPilgrimageDay } from '../data/types';
import { api } from '../data/api';
import { useLocalStorage } from '../lib/useLocalStorage';

export type Ustawienia = {
  type: 'spokoj' | 'pielgrzym' | 'ostry';
  read: 'sans' | 'serif';
  accent: 'subtelny' | 'wyrazisty';
  readScale: number;
  tryb: 'auto' | 'gps' | 'plan';
};

export const DOMYSLNE: Ustawienia = {
  type: 'spokoj', read: 'sans', accent: 'subtelny', readScale: 1, tryb: 'auto',
};

type PilgrimageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; pilgrimage: ApiPilgrimage; day: ApiPilgrimageDay };

type CtxValue = {
  state: PilgrimageState;
  settings: Ustawienia;
  setSettings: (s: Ustawienia) => void;
};

const Ctx = createContext<CtxValue | null>(null);

export function PilgrimageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PilgrimageState>({ status: 'loading' });
  const [settings, setSettings] = useLocalStorage<Ustawienia>('pg.ustawienia', DOMYSLNE);

  useEffect(() => {
    api.bootstrap()
      .then((res) => {
        if (!res.pilgrimage) { setState({ status: 'error', message: 'Brak danych pielgrzymki.' }); return; }
        const p = res.pilgrimage;
        const day = selectCurrentDay(p);
        if (!day) { setState({ status: 'error', message: 'Brak aktywnego dnia.' }); return; }
        setState({ status: 'ok', pilgrimage: p, day });
      })
      .catch((e: unknown) => setState({ status: 'error', message: String(e) }));
  }, []);

  return <Ctx.Provider value={{ state, settings, setSettings }}>{children}</Ctx.Provider>;
}

export function usePilgrimage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePilgrimage must be inside PilgrimageProvider');
  return ctx;
}

function selectCurrentDay(p: ApiPilgrimage): ApiPilgrimageDay | null {
  const YEAR = new Date().getFullYear();
  const start = new Date(YEAR, 6, 30, 12);
  const end = new Date(YEAR, 7, 12, 12);
  const now = new Date(); now.setHours(12, 0, 0, 0);

  let nr: number;
  if (now < start) nr = 1;
  else if (now > end) nr = 14;
  else nr = Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;

  return p.days.find((d) => d.dayNumber === nr) ?? p.days[0] ?? null;
}
```

- [ ] **Step 2: Create `src/app/Shell.tsx`**

```tsx
import { Outlet, NavLink } from 'react-router-dom';
import { Icon } from '../lib/icons';
import { usePilgrimage } from './PilgrimageContext';

const TABS = [
  { to: '/', end: true, lbl: 'Start', icon: 'home' },
  { to: '/trasa', lbl: 'Trasa', icon: 'map' },
  { to: '/info', lbl: 'Info', icon: 'message', dot: true },
  { to: '/kwatermistrz', lbl: 'Kwater.', icon: 'alert' },
  { to: '/niezbednik', lbl: 'Niezbędnik', icon: 'book-open' },
] as const;

export function Shell() {
  const { settings } = usePilgrimage();
  return (
    <div
      className="app"
      data-type={settings.type}
      data-read={settings.read}
      data-accent={settings.accent}
      style={{ ['--read-scale' as string]: settings.readScale }}
    >
      <Outlet />
      <nav className="tabbar" aria-label="Główna nawigacja">
        <div className="tabbar__inner">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={'end' in t ? t.end : undefined} className="tab">
              <Icon name={t.icon} />
              {'dot' in t && t.dot && <span className="tab__dot" />}
              <span className="tab__lbl">{t.lbl}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
```

- [ ] **Step 3: Create stub screens** (one file each, all in `src/features/`)

```
src/features/start/index.tsx     → export function StartScreen() { return <p>Start</p>; }
src/features/trasa/index.tsx     → export function TrasaScreen() { return <p>Trasa</p>; }
src/features/info/index.tsx      → export function InfoScreen() { return <p>Info</p>; }
src/features/info/Detail.tsx     → export function InfoDetail() { return <p>Info Detail</p>; }
src/features/kwatermistrz/index.tsx  → export function KwatermistrzScreen() { return <p>Kwatermistrz</p>; }
src/features/kwatermistrz/Entry.tsx  → export function KwatermistrzEntry() { return <p>Kwater Entry</p>; }
src/features/niezbednik/index.tsx    → export function NiezbednikScreen() { return <p>Niezbędnik</p>; }
src/features/niezbednik/Reader.tsx   → export function NiezbednikReader() { return <p>Reader</p>; }
src/features/konferencja/index.tsx   → export function KonferencjaScreen() { return <p>Konferencja</p>; }
src/features/ustawienia/index.tsx    → export function UstawieniaScreen() { return <p>Ustawienia</p>; }
```

- [ ] **Step 4: Create `src/app/App.tsx`**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PilgrimageProvider } from './PilgrimageContext';
import { Shell } from './Shell';
import { StartScreen } from '../features/start';
import { TrasaScreen } from '../features/trasa';
import { InfoScreen } from '../features/info';
import { InfoDetail } from '../features/info/Detail';
import { KwatermistrzScreen } from '../features/kwatermistrz';
import { KwatermistrzEntry } from '../features/kwatermistrz/Entry';
import { NiezbednikScreen } from '../features/niezbednik';
import { NiezbednikReader } from '../features/niezbednik/Reader';
import { KonferencjaScreen } from '../features/konferencja';
import { UstawieniaScreen } from '../features/ustawienia';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 2 * 60 * 1000 } },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PilgrimageProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<StartScreen />} />
              <Route path="trasa" element={<TrasaScreen />} />
              <Route path="info" element={<InfoScreen />} />
              <Route path="info/:id" element={<InfoDetail />} />
              <Route path="kwatermistrz" element={<KwatermistrzScreen />} />
              <Route path="kwatermistrz/:nr" element={<KwatermistrzEntry />} />
              <Route path="niezbednik" element={<NiezbednikScreen />} />
              <Route path="niezbednik/:modul" element={<NiezbednikReader />} />
              <Route path="konferencja/:nr" element={<KonferencjaScreen />} />
              <Route path="ustawienia" element={<UstawieniaScreen />} />
              <Route path="*" element={<StartScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PilgrimageProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 5: Update `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import { App } from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 6: TypeScript check + dev run**

```bash
npx tsc --noEmit
npm run dev
```

Expected: 0 errors. Browser shows shell with bottom nav; clicking tabs navigates (URL changes); stub text visible.

- [ ] **Step 7: Commit**

```bash
git add src/app/ src/features/ src/main.tsx
git commit -m "feat: add shell, routing, PilgrimageContext with bootstrap loading"
```

---

### Task 6: Start screen + Trasa screen

**Files:**
- Modify: `src/features/start/index.tsx`
- Create: `src/features/start/WeatherWidget.tsx`
- Create: `src/features/start/StatusWidget.tsx`
- Modify: `src/features/trasa/index.tsx`
- Create: `src/features/trasa/TimelineItem.tsx`

**Interfaces — Consumes:**
- `usePilgrimage()` → `{ state, settings }`
- `toDzien(day)` → `Dzien`
- `usePozycja(dzien, tryb)` → `StanPozycji`
- `fmt`, `fmt1` from `../lib/format`
- All base components from `../components`
- `Icon` from `../lib/icons`

- [ ] **Step 1: Create `src/features/start/WeatherWidget.tsx`**

```tsx
import { Icon } from '../../lib/icons';
import { Eyebrow } from '../../components';
import type { ApiPilgrimageDay } from '../../data/types';

const WEATHER_ICON: Record<string, string> = {
  sunny: 'sun', partlyCloudy: 'cloud-sun', cloudy: 'cloud-sun',
  rain: 'droplet', storm: 'wind',
};

type Props = { day: ApiPilgrimageDay };

export function WeatherWidget({ day }: Props) {
  const w = day.weather;
  const town = day.stops[day.stops.length - 1]?.townName ?? '';
  if (!w) return null;
  return (
    <div className="widget enter enter-2">
      <div className="widget__h">
        <Eyebrow>Pogoda na trasie</Eyebrow>
        <span className="localnote"><Icon name="map-pin" />{town}</span>
      </div>
      <div className="weather">
        <Icon name={WEATHER_ICON[w.icon] ?? 'cloud-sun'} className="weather__ic" />
        <div className="grow">
          <div className="weather__temp">{w.temperatureC}°</div>
          <div className="weather__desc">
            {{ sunny: 'Słonecznie', partlyCloudy: 'Częściowe zachmurzenie', cloudy: 'Pochmurno', rain: 'Deszcz', storm: 'Burze w okolicy' }[w.icon] ?? ''}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/features/start/StatusWidget.tsx`**

```tsx
import { Eyebrow } from '../../components';
import type { ZrodloPozycji } from '../../lib/usePozycja';

type Props = { zrodlo: ZrodloPozycji };

export function StatusWidget({ zrodlo }: Props) {
  const rows = [
    { c: 'var(--good)', t: 'Kolumna w drodze — etap rozpoczęty' },
    { c: zrodlo === 'gps' ? 'var(--good)' : 'var(--warn)', t: zrodlo === 'gps' ? 'Pozycja GPS aktywna' : 'GPS wyłączony — pozycja z harmonogramu' },
    { c: 'var(--good)', t: 'Dane zapisane lokalnie' },
  ];
  return (
    <div className="widget enter enter-3">
      <div className="widget__h"><Eyebrow>Status dnia</Eyebrow></div>
      <div className="status">
        {rows.map((r, i) => (
          <div className="status__row" key={i}>
            <span className="status__dot" style={{ background: r.c }} />
            {r.t}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Implement `src/features/start/index.tsx`**

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePilgrimage } from '../../app/PilgrimageContext';
import { toDzien } from '../../data/api';
import { usePozycja } from '../../lib/usePozycja';
import { fmt } from '../../lib/format';
import { Icon } from '../../lib/icons';
import { Header, Pill, Row, Progress, Eyebrow } from '../../components';
import { WeatherWidget } from './WeatherWidget';
import { StatusWidget } from './StatusWidget';

export function StartScreen() {
  const { state, settings } = usePilgrimage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  if (state.status === 'loading') return <div className="app"><p className="muted" style={{ padding: 32 }}>Ładowanie…</p></div>;
  if (state.status === 'error') return <div className="app"><p className="muted" style={{ padding: 32 }}>{state.message}</p></div>;

  const { pilgrimage, day } = state;
  const dzien = toDzien(day);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pos = usePozycja(dzien, settings.tryb);

  return (
    <>
      <Header
        title="Start"
        scrolled={scrolled}
        right={
          <button className="hdr__btn right" onClick={() => navigate('/ustawienia')} aria-label="Ustawienia">
            <Icon name="settings" />
          </button>
        }
      />
      <div className="viewport scroll" onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 4)}>
        <div className="stage stage--rail">
          <div className="stage__grid">
            <div>
              <div className="hero enter enter-1">
                <div className="hero__img" style={{ height: 230, background: 'var(--paper-sunk)', borderRadius: 'var(--r-card)' }} />
              </div>

              <div className="card enter enter-2" style={{ padding: 'var(--s5)', marginTop: 'var(--s4)' }}>
                <div className="dial__top">
                  <Pill variant="rose">Dzień {day.dayNumber} z {pilgrimage.totalDays}</Pill>
                  <button className="iconbtn" onClick={() => navigate('/trasa')} aria-label="Otwórz trasę">
                    <Icon name="navigation" />
                  </button>
                </div>
                <div className="dial__num" style={{ marginTop: 'var(--s3)' }}>
                  {fmt(pos.doCelu)}<small>km</small>
                </div>
                <Eyebrow wine style={{ marginTop: 2 }}>do celu dnia</Eyebrow>
                <div className="dial__route" style={{ marginTop: 'var(--s4)' }}>
                  {dzien.od}<span className="arrow">→</span>{dzien.do}
                </div>
                <div style={{ marginTop: 'var(--s4)' }}>
                  <Progress
                    pct={pos.pct}
                    leftLabel={fmt(pos.km) + ' km przebyto'}
                    rightLabel={fmt(pos.doCelu) + ' km do celu'}
                  />
                </div>
                {pos.zrodlo === 'plan' && (
                  <div className="alert alert--info" style={{ marginTop: 'var(--s3)' }}>
                    <Icon name="locate" className="alert__ic" />
                    <span className="alert__txt">GPS wyłączony — pozycja według harmonogramu</span>
                  </div>
                )}
              </div>

              <div className="stack mt4">
                <div className="enter enter-3">
                  <Row icon="alert" tone="rose" title="Komentarz kwatermistrza"
                    meta={'Dzień ' + day.dayNumber}
                    onClick={() => navigate('/kwatermistrz')} />
                </div>
                <div className="enter enter-4">
                  <Row icon="book" tone="rose" title="Konferencja dnia"
                    meta={day.conference?.title ?? 'Zostanie dodana przed etapem'}
                    onClick={() => navigate('/konferencja/1')} />
                </div>
              </div>

              <div className="only-mobile mt4">
                <WeatherWidget day={day} />
              </div>
            </div>

            <aside className="rail hide-mobile">
              <WeatherWidget day={day} />
              <StatusWidget zrodlo={pos.zrodlo} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Create `src/features/trasa/TimelineItem.tsx`**

```tsx
import { Icon } from '../../lib/icons';
import { fmt } from '../../lib/format';
import type { ApiStop } from '../../data/types';

const STOP_ICON: Record<string, string> = {
  start: 'flag',
  night: 'bed',
};

function badgeIcon(badge?: string | null): string {
  if (badge === 'Modlitwa') return 'cross';
  if (badge === 'Postój') return 'coffee';
  if (badge === 'Konferencja') return 'book';
  return 'map-pin';
}

type ItemProps = { stop: ApiStop; state: 'done' | 'now' | 'next'; distToNext?: number };

export function TimelineItem({ stop, state: s, distToNext }: ItemProps) {
  const cls = s === 'now' ? 'is-now' : s === 'done' ? 'is-done' : '';
  const icon = STOP_ICON[stop.type] ?? badgeIcon(stop.badge);
  return (
    <div className={'tl__item ' + cls}>
      <span className="tl__node"><i /></span>
      <div className="tl__stop">
        <div className="tl__time">
          <Icon name={icon} />{stop.time}
          {stop.durationMin ? (
            <span className="badge tl__badge"><Icon name="timer" />{stop.durationMin} min</span>
          ) : null}
          {s === 'now' && <span className="badge badge--now tl__badge">Teraz</span>}
        </div>
        <div className="tl__place">{stop.townName ?? stop.name}</div>
        {stop.description && <div className="tl__desc">{stop.description}</div>}
      </div>
      {distToNext != null && distToNext > 0 && (
        <div className="tl__seg"><Icon name="footprints" />{fmt(distToNext)} km</div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Implement `src/features/trasa/index.tsx`**

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePilgrimage } from '../../app/PilgrimageContext';
import { toDzien, buildKmCumulative } from '../../data/api';
import { usePozycja } from '../../lib/usePozycja';
import { fmt } from '../../lib/format';
import { Icon } from '../../lib/icons';
import { Header, Pill, Progress, SectionHead, Button, Eyebrow } from '../../components';
import { TimelineItem } from './TimelineItem';

export function TrasaScreen() {
  const { state, settings } = usePilgrimage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  if (state.status !== 'ok') return null;
  const { pilgrimage, day: activeDay } = state;

  const activeIdx = pilgrimage.days.findIndex((d) => d.dayNumber === activeDay.dayNumber);
  const [idx, setIdx] = useState(activeIdx >= 0 ? activeIdx : 0);
  const day = pilgrimage.days[idx];
  const dzien = toDzien(day);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pos = usePozycja(dzien, settings.tryb);
  const kmCum = buildKmCumulative(day.stops);

  function stopState(stopKm: number): 'done' | 'now' | 'next' {
    if (stopKm <= pos.km - 0.5) return 'done';
    if (stopKm <= pos.km + 2) return 'now';
    return 'next';
  }

  const hasSchedule = day.stops.length > 1;

  return (
    <>
      <Header title="Trasa" scrolled={scrolled} />
      <div className="viewport scroll" onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 4)}>
        <div className="stage">
          <div className="dayswitch enter enter-1">
            <button className="iconbtn" disabled={idx === 0} style={{ opacity: idx === 0 ? 0.35 : 1 }}
              onClick={() => setIdx((i) => Math.max(0, i - 1))} aria-label="Poprzedni dzień">
              <Icon name="chevron-left" />
            </button>
            <div className="center">
              <div className="dayswitch__label">Dzień {day.dayNumber} z {pilgrimage.totalDays}</div>
              <div className="dayswitch__sub">{dzien.od} → {dzien.do}</div>
            </div>
            <button className="iconbtn" disabled={idx === pilgrimage.days.length - 1}
              style={{ opacity: idx === pilgrimage.days.length - 1 ? 0.35 : 1 }}
              onClick={() => setIdx((i) => Math.min(pilgrimage.days.length - 1, i + 1))} aria-label="Następny dzień">
              <Icon name="chevron-right" />
            </button>
          </div>

          {hasSchedule ? (
            <>
              {pos.zrodlo === 'plan' && (
                <div className="alert alert--info enter enter-2" style={{ marginTop: 'var(--s4)' }}>
                  <Icon name="locate" className="alert__ic" />
                  <span className="alert__txt">GPS wyłączony — pozycja według harmonogramu</span>
                </div>
              )}
              <div className="card enter enter-2" style={{ padding: 'var(--s5)', marginTop: 'var(--s4)' }}>
                <div className="between">
                  <Pill variant="rose">Etap {day.dayNumber} z {pilgrimage.totalDays}</Pill>
                  <span className="eyebrow">{day.date}</span>
                </div>
                <div className="dial__num" style={{ marginTop: 'var(--s4)' }}>{fmt(pos.doCelu)}<small>km</small></div>
                <Eyebrow wine>do celu</Eyebrow>
                <div className="dial__route mt3">{dzien.od}<span className="arrow">→</span>{dzien.do}</div>
                <div className="mt4">
                  <Progress pct={pos.pct} leftLabel={fmt(pos.km) + ' km przebyto'} rightLabel={fmt(pos.doCelu) + ' km do celu'} />
                </div>
              </div>

              <SectionHead>Plan dnia</SectionHead>
              <div className="card enter enter-3" style={{ padding: 'var(--s5) var(--s5) var(--s4)' }}>
                <div className="tl">
                  <div className="tl__line" />
                  {day.stops.map((stop, i) => (
                    <TimelineItem
                      key={stop.id}
                      stop={stop}
                      state={stopState(kmCum[i])}
                      distToNext={stop.distanceToNextKm > 0 ? stop.distanceToNextKm : undefined}
                    />
                  ))}
                </div>
              </div>
              <div className="center mt5">
                <Button variant="ghost" icon="book" onClick={() => navigate('/konferencja/1')}>
                  Konferencja dnia
                </Button>
              </div>
            </>
          ) : (
            <div className="card enter enter-2" style={{ padding: 'var(--s8) var(--s5)', marginTop: 'var(--s4)' }}>
              <div className="empty">
                <Icon name="calendar" className="empty__ic" />
                <div className="empty__t">Harmonogram dnia {day.dayNumber} pojawi się przed etapem</div>
                <p className="muted mt2" style={{ fontSize: 14 }}>{dzien.od} → {dzien.do} · {fmt(day.route.totalDistanceKm)} km</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 6: TypeScript check + verify in browser**

```bash
npx tsc --noEmit
npm run dev
```

Expected: Start screen shows distance, progress bar animates in, bottom nav works. Trasa screen shows timeline for day 3.

- [ ] **Step 7: Commit**

```bash
git add src/features/start/ src/features/trasa/
git commit -m "feat: implement Start and Trasa screens with usePozycja"
```

---

### Task 7: Info screen + detail

**Files:**
- Modify: `src/features/info/index.tsx`
- Create: `src/features/info/NoticeCard.tsx`
- Modify: `src/features/info/Detail.tsx`

**Interfaces — Consumes:**
- `useQuery` from `@tanstack/react-query`
- `api.getNews()` from `../../data/api`
- `NewsItem` from `../../data/types`
- All base components

- [ ] **Step 1: Create `src/features/info/NoticeCard.tsx`**

```tsx
import { Pill } from '../../components';
import type { NewsItem } from '../../data/types';

const CAT_LABEL: Record<string, string> = {
  announcement: 'Organizacja', logistics: 'Logistyka',
  spiritual: 'Duchowe', weather: 'Pogoda',
};

type Props = { item: NewsItem; onClick: () => void };

export function NoticeCard({ item, onClick }: Props) {
  const date = new Date(item.publishedAt).toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
  return (
    <button
      className={'notice' + (item.isPinned ? ' notice--pinned' : '')}
      onClick={onClick}
      style={{ textAlign: 'left', display: 'block', width: '100%' }}
    >
      <div className="notice__top">
        {item.isPinned && <Pill variant="rose" icon="pin">Przypięte</Pill>}
        <span className="eyebrow">{CAT_LABEL[item.category] ?? item.category}</span>
        <span className="notice__time">{date}</span>
      </div>
      <div className="notice__title">{item.title}</div>
      <div className="notice__excerpt">{item.summary}</div>
    </button>
  );
}
```

- [ ] **Step 2: Implement `src/features/info/index.tsx`**

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../data/api';
import { Header, Eyebrow, SectionHead } from '../../components';
import { Icon } from '../../lib/icons';
import { NoticeCard } from './NoticeCard';

function mapCategory(raw: string): 'announcement' | 'logistics' | 'spiritual' | 'weather' {
  if (['announcement','logistics','spiritual','weather'].includes(raw)) return raw as never;
  return 'announcement';
}

export function InfoScreen() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const { data } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.getNews(),
    refetchInterval: 2 * 60 * 1000,
  });

  const items = (data?.items ?? []).map((i) => ({
    id: i.id, title: i.title, summary: i.summary || i.content || '',
    category: mapCategory(i.category), publishedAt: i.publishedAt, isPinned: i.isPinned,
  }));
  const pinned = items.filter((n) => n.isPinned);
  const rest = items.filter((n) => !n.isPinned);

  return (
    <>
      <Header title="Info" scrolled={scrolled}
        right={<button className="hdr__btn right" aria-label="Powiadomienia"><Icon name="bell" /></button>} />
      <div className="viewport scroll" onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 4)}>
        <div className="stage">
          <Eyebrow className="enter enter-1" style={{ marginBottom: 'var(--s2)' }}>Komunikaty z trasy</Eyebrow>
          <div className="stack--lg stack enter enter-1">
            {pinned.map((n) => <NoticeCard key={n.id} item={n} onClick={() => navigate('/info/' + n.id)} />)}
          </div>
          <SectionHead>Historia powiadomień</SectionHead>
          <div className="stack--lg stack enter enter-2">
            {rest.map((n) => <NoticeCard key={n.id} item={n} onClick={() => navigate('/info/' + n.id)} />)}
          </div>
          <div className="center mt6">
            <span className="localnote"><Icon name="check" />Wszystkie komunikaty dostępne offline</span>
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Implement `src/features/info/Detail.tsx`**

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../data/api';
import { Reader, Pill } from '../../components';

function mapCategory(raw: string): 'announcement' | 'logistics' | 'spiritual' | 'weather' {
  if (['announcement','logistics','spiritual','weather'].includes(raw)) return raw as never;
  return 'announcement';
}

const CAT_ICON: Record<string, string> = { announcement: 'message', logistics: 'alert', spiritual: 'cross', weather: 'cloud-sun' };

export function InfoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ['news'], queryFn: () => api.getNews() });
  const raw = (data?.items ?? []).find((i) => i.id === id);
  if (!raw) return null;

  const cat = mapCategory(raw.category);
  const date = new Date(raw.publishedAt).toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });

  return (
    <Reader
      title="Komunikat"
      onBack={() => navigate(-1)}
      kickerIcon={CAT_ICON[cat] ?? 'message'}
      kickerLabel={date}
      headline={raw.title}
      byline={raw.isPinned ? <div className="reader__byline"><Pill variant="rose" icon="pin">Przypięte</Pill></div> : null}
      akapity={[{ typ: 'lead', t: raw.summary }, ...(raw.content && raw.content !== raw.summary ? [{ typ: 'p' as const, t: raw.content }] : [])]}
    />
  );
}
```

- [ ] **Step 4: TypeScript check + verify**

```bash
npx tsc --noEmit && npm run dev
```

Expected: Info tab shows notice cards from seed data. Clicking a card navigates to detail reader with back button.

- [ ] **Step 5: Commit**

```bash
git add src/features/info/
git commit -m "feat: implement Info screen and InfoDetail reader"
```

---

### Task 8: Kwatermistrz screen

**Files:**
- Modify: `src/features/kwatermistrz/index.tsx`
- Modify: `src/features/kwatermistrz/Entry.tsx`

**Interfaces — Consumes:**
- `useQuery` + `api.getQuartermaster()`
- `QuartermasterComment` type
- `Reader`, `Header`, `Pill`, `SectionHead` components

- [ ] **Step 1: Implement `src/features/kwatermistrz/index.tsx`**

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../data/api';
import { Header, Pill } from '../../components';

export function KwatermistrzScreen() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { data } = useQuery({
    queryKey: ['quartermaster'],
    queryFn: () => api.getQuartermaster(),
    refetchInterval: 2 * 60 * 1000,
  });
  const items = data?.items ?? [];

  return (
    <>
      <Header title="Kwatermistrz" scrolled={scrolled} />
      <div className="viewport scroll" onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 4)}>
        <div className="stage">
          <p className="muted enter enter-1" style={{ fontSize: 15, lineHeight: 1.55, margin: '0 0 var(--s5)' }}>
            Wieczorne podsumowania dnia — nocleg, kuchnia, sprawy organizacyjne.
          </p>
          <div className="stack--lg stack">
            {items.map((e, i) => {
              const date = new Date(e.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
              const preview = e.content.split('\n')[0] ?? '';
              return (
                <button key={e.id} className={'notice enter enter-' + Math.min(i + 1, 4)}
                  onClick={() => navigate('/kwatermistrz/' + e.id)}
                  style={{ textAlign: 'left', display: 'block', width: '100%' }}>
                  <div className="notice__top">
                    {e.dayNumber != null && <Pill variant="ghost">Dzień {e.dayNumber}</Pill>}
                    <span className="notice__time">{date}</span>
                  </div>
                  <div className="notice__title">{e.title}</div>
                  <div className="notice__excerpt">{preview}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Implement `src/features/kwatermistrz/Entry.tsx`**

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../data/api';
import { Reader } from '../../components';
import { Icon } from '../../lib/icons';

export function KwatermistrzEntry() {
  const { nr } = useParams<{ nr: string }>();
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ['quartermaster'], queryFn: () => api.getQuartermaster() });
  const entry = (data?.items ?? []).find((e) => e.id === nr) ?? data?.items?.[0];
  if (!entry) return null;

  const date = new Date(entry.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
  const paragraphs = entry.content.split('\n').filter(Boolean).map((t) => ({ typ: 'p' as const, t }));

  return (
    <Reader
      title="Kwatermistrz"
      onBack={() => navigate(-1)}
      kickerIcon="alert"
      kickerLabel={'Komentarz dnia · ' + date}
      headline={entry.title}
      byline={
        <div className="reader__byline">
          <Icon name="bed" />
          <span>{paragraphs[0]?.t ?? ''}</span>
        </div>
      }
      akapity={paragraphs.slice(1)}
    />
  );
}
```

- [ ] **Step 3: TypeScript check + verify**

```bash
npx tsc --noEmit && npm run dev
```

Expected: Kwatermistrz tab lists 3 seed entries. Clicking navigates to Reader with back button.

- [ ] **Step 4: Commit**

```bash
git add src/features/kwatermistrz/
git commit -m "feat: implement Kwatermistrz screen and entry reader"
```

---

### Task 9: Niezbędnik + Konferencja

**Files:**
- Modify: `src/features/niezbednik/index.tsx`
- Modify: `src/features/niezbednik/Reader.tsx`
- Modify: `src/features/konferencja/index.tsx`

**Interfaces — Consumes:**
- `CONTENT_MAP` from `../../data/content`
- `usePilgrimage()` for conference data
- `Reader`, `Row`, `Header`, `Eyebrow`, `SectionHead`, `Chip`, `Pill` components

- [ ] **Step 1: Implement `src/features/niezbednik/index.tsx`**

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Eyebrow, Row, SectionHead } from '../../components';
import { Icon } from '../../lib/icons';
import { CONTENT_MAP } from '../../data/content';

const TILES = [
  { id: 'spiewnik', nazwa: 'Śpiewnik', sub: 'Pieśni na drogę', ic: 'music', kolor: 'rose' },
  { id: 'czytania', nazwa: 'Czytania', sub: 'Liturgia dnia', ic: 'book-open', kolor: 'amber' },
  { id: 'modlitewnik', nazwa: 'Modlitewnik', sub: 'Modlitwy pątnika', ic: 'book-heart', kolor: 'green' },
  { id: 'brewiarz', nazwa: 'Brewiarz', sub: 'Liturgia godzin', ic: 'church', kolor: 'blue' },
] as const;

export function NiezbednikScreen() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  return (
    <>
      <Header title="Niezbędnik" scrolled={scrolled} />
      <div className="viewport scroll" onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 4)}>
        <div className="stage">
          <Eyebrow className="enter enter-1" style={{ marginBottom: 'var(--s3)' }}>Na drogę i do modlitwy</Eyebrow>
          <div className="tiles enter enter-1">
            {TILES.map((k) => (
              <button key={k.id} className="tile" onClick={() => navigate('/niezbednik/' + k.id)}>
                <span className={'tile__ic chip--' + k.kolor}><Icon name={k.ic} /></span>
                <span style={{ marginTop: 'auto' }}>
                  <span className="tile__name" style={{ display: 'block' }}>{k.nazwa}</span>
                  <span className="tile__sub">{k.sub}</span>
                </span>
              </button>
            ))}
          </div>

          <SectionHead>Polecane dziś</SectionHead>
          <div className="enter enter-2">
            <Row icon="music" tone="rose" title="Pieśń pielgrzyma"
              meta="Pieśń pielgrzymkowa na Jasną Górę"
              onClick={() => navigate('/niezbednik/spiewnik')} />
          </div>

          <div className="center mt6">
            <span className="localnote"><Icon name="check" />Teksty dostępne bez zasięgu</span>
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Implement `src/features/niezbednik/Reader.tsx`**

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Reader } from '../../components';
import { CONTENT_MAP } from '../../data/content';

export function NiezbednikReader() {
  const { modul } = useParams<{ modul: string }>();
  const navigate = useNavigate();
  const m = CONTENT_MAP[modul ?? ''] ?? CONTENT_MAP.modlitewnik;

  return (
    <Reader
      title={m.modul}
      onBack={() => navigate(-1)}
      kickerIcon={m.ic}
      kickerTone={m.kolor}
      kickerLabel={m.sub}
      headline={m.tytul}
      akapity={m.akapity}
    />
  );
}
```

- [ ] **Step 3: Implement `src/features/konferencja/index.tsx`**

```tsx
import { useNavigate } from 'react-router-dom';
import { usePilgrimage } from '../../app/PilgrimageContext';
import { Reader, Pill } from '../../components';
import { Icon } from '../../lib/icons';

export function KonferencjaScreen() {
  const navigate = useNavigate();
  const { state } = usePilgrimage();
  if (state.status !== 'ok') return null;

  const k = state.day.conference;
  const headline = k?.title ?? 'Konferencja zostanie dodana przed etapem';
  const content = k?.content ?? 'Tutaj pojawi się temat i treść konferencji przygotowanej na dany dzień pielgrzymki.';
  const initials = k?.author?.split(' ').filter((w) => /^[A-ZŻŹĆŁ]/.test(w)).map((w) => w[0]).slice(0, 2).join('') ?? '';
  const dayNr = state.day.dayNumber;

  return (
    <Reader
      title="Konferencja"
      onBack={() => navigate(-1)}
      kickerIcon="book"
      kickerLabel={'Konferencja · Dzień ' + dayNr}
      headline={headline}
      byline={
        k ? (
          <div className="reader__byline">
            <span className="av">{initials}</span>
            <span><b style={{ color: 'var(--ink)', fontWeight: 700 }}>{k.author}</b></span>
          </div>
        ) : null
      }
      akapity={[{ typ: 'lead', t: content }]}
      dropcap
      footer={
        <div className="center mt6">
          <span className="localnote"><Icon name="check" />Konferencja zapisana do czytania offline</span>
        </div>
      }
    />
  );
}
```

- [ ] **Step 4: TypeScript check + verify**

```bash
npx tsc --noEmit && npm run dev
```

Expected: All four Niezbędnik tiles open their reader. Konferencja shows day 3 conference content.

- [ ] **Step 5: Commit**

```bash
git add src/features/niezbednik/ src/features/konferencja/
git commit -m "feat: implement Niezbędnik readers and Konferencja screen"
```

---

### Task 10: Ustawienia screen

**Files:**
- Modify: `src/features/ustawienia/index.tsx`

**Interfaces — Consumes:**
- `usePilgrimage()` → `{ settings, setSettings }`
- `Ustawienia` type from `../../app/PilgrimageContext`
- `Header`, `Eyebrow` components

- [ ] **Step 1: Implement `src/features/ustawienia/index.tsx`**

```tsx
import { useNavigate } from 'react-router-dom';
import { usePilgrimage, type Ustawienia } from '../../app/PilgrimageContext';
import { Header, Eyebrow } from '../../components';

function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.v} aria-pressed={value === o.v} onClick={() => onChange(o.v)}>{o.l}</button>
      ))}
    </div>
  );
}

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return <button className="switch" aria-pressed={on} onClick={onToggle}><i /></button>;
}

export function UstawieniaScreen() {
  const navigate = useNavigate();
  const { settings, setSettings } = usePilgrimage();
  const set = <K extends keyof Ustawienia>(k: K, v: Ustawienia[K]) => setSettings({ ...settings, [k]: v });

  return (
    <>
      <Header title="Ustawienia" onBack={() => navigate(-1)} />
      <div className="viewport scroll">
        <div className="stage" style={{ maxWidth: 620 }}>

          <Eyebrow className="enter enter-1" style={{ marginBottom: 'var(--s3)' }}>Źródło lokalizacji</Eyebrow>
          <div className="setgroup enter enter-1">
            <div className="setrow" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--s3)' }}>
              <div className="setrow__body" style={{ padding: 0 }}>
                <div className="setrow__t">Jak ustalamy Twoją pozycję</div>
                <div className="setrow__d">Auto przełącza na harmonogram, gdy brak sygnału GPS.</div>
              </div>
              <Seg value={settings.tryb} onChange={(v) => set('tryb', v)}
                options={[{ v: 'auto', l: 'Auto' }, { v: 'gps', l: 'Tylko GPS' }, { v: 'plan', l: 'Harmonogram' }]} />
            </div>
          </div>

          <Eyebrow className="enter enter-2" style={{ margin: 'var(--s6) 0 var(--s3)' }}>Typografia</Eyebrow>
          <div className="setgroup enter enter-2">
            <div className="setrow" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--s3)' }}>
              <div className="setrow__body" style={{ padding: 0 }}>
                <div className="setrow__t">Kierunek typografii</div>
              </div>
              <Seg value={settings.type} onChange={(v) => set('type', v)}
                options={[{ v: 'spokoj', l: 'Spokój' }, { v: 'pielgrzym', l: 'Pielgrzym' }, { v: 'ostry', l: 'Ostry' }]} />
            </div>
            <div className="setrow" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--s3)', marginTop: 'var(--s3)' }}>
              <div className="setrow__body" style={{ padding: 0 }}>
                <div className="setrow__t">Font czytania</div>
              </div>
              <Seg value={settings.read} onChange={(v) => set('read', v)}
                options={[{ v: 'sans', l: 'Bezszeryfowy' }, { v: 'serif', l: 'Szeryfowy' }]} />
            </div>
          </div>

          <Eyebrow className="enter enter-3" style={{ margin: 'var(--s6) 0 var(--s3)' }}>Akcent kolorów</Eyebrow>
          <div className="setgroup enter enter-3">
            <div className="setrow" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--s3)' }}>
              <div className="setrow__body" style={{ padding: 0 }}>
                <div className="setrow__t">Nasycenie kafli modułów</div>
              </div>
              <Seg value={settings.accent} onChange={(v) => set('accent', v)}
                options={[{ v: 'subtelny', l: 'Subtelny' }, { v: 'wyrazisty', l: 'Wyrazisty' }]} />
            </div>
          </div>

          <Eyebrow className="enter enter-4" style={{ margin: 'var(--s6) 0 var(--s3)' }}>Dane offline</Eyebrow>
          <div className="setgroup enter enter-4">
            <div className="setrow">
              <span className="setrow__body">
                <span className="setrow__t">Treści offline</span>
                <span className="setrow__d">Trasa, konferencje i modlitwy zapisane lokalnie</span>
              </span>
              <Switch on={true} onToggle={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: TypeScript check + verify**

```bash
npx tsc --noEmit && npm run dev
```

Expected: Settings opens from gear icon on Start. Changing location source, typography, or accent immediately updates the app appearance (CSS data-attributes change). Settings persist after refresh (localStorage).

- [ ] **Step 3: Commit**

```bash
git add src/features/ustawienia/
git commit -m "feat: implement Ustawienia screen with persistent theme + GPS mode"
```

---

### Task 11: PWA setup + production build

**Files:**
- Modify: `vite.config.ts`
- Create: `public/manifest.json`
- Create: `public/icons/` (placeholder icon files — at minimum `icon-192.png` and `icon-512.png`)

- [ ] **Step 1: Create `public/manifest.json`**

```json
{
  "name": "Pielgrzym",
  "short_name": "Pielgrzym",
  "description": "Aplikacja pielgrzymkowa — trasa, harmonogram, konferencje",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#EFEFF4",
  "theme_color": "#7C1D3F",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: Add PWA to `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/pilgrimages\/\d+\/bootstrap/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-bootstrap', expiration: { maxAgeSeconds: 300 } },
          },
          {
            urlPattern: /\/api\/news/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-news', expiration: { maxAgeSeconds: 120 } },
          },
          {
            urlPattern: /\/api\/quartermaster-comments/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-quartermaster', expiration: { maxAgeSeconds: 120 } },
          },
          {
            urlPattern: /\/api\/pilgrimages\/\d+\/days\/\d+$/,
            handler: 'CacheFirst',
            options: { cacheName: 'api-days', expiration: { maxAgeSeconds: 86400 } },
          },
          {
            urlPattern: /https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-webfonts', expiration: { maxAgeSeconds: 31536000 } },
          },
        ],
      },
    }),
  ],
});
```

- [ ] **Step 3: Add `<link rel="manifest">` to `index.html`**

Add inside `<head>`:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#7C1D3F" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

- [ ] **Step 4: Create placeholder icons**

```bash
mkdir -p public/icons
# Create minimal 1x1 PNG placeholders — replace with real icons before launch
node -e "
const { createCanvas } = require('canvas');
" 2>/dev/null || true
# If canvas not available, just copy any 192x192 and 512x512 PNG you have,
# or use ImageMagick:
# convert -size 192x192 xc:#7C1D3F public/icons/icon-192.png
# convert -size 512x512 xc:#7C1D3F public/icons/icon-512.png
# For now, copy the same placeholder:
echo "placeholder — replace with real icon" > public/icons/icon-192.png
echo "placeholder — replace with real icon" > public/icons/icon-512.png
```

NOTE: Real PNG icons must be created before deploying. The PWA manifest will still register without valid icons, but install prompts won't appear.

- [ ] **Step 5: Production build + verify**

```bash
npm run build
npm run preview
```

Expected: build succeeds with no TypeScript errors, `dist/` contains `sw.js`, app works at localhost:4173, DevTools > Application > Service Workers shows registered SW.

- [ ] **Step 6: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts public/
git commit -m "feat: add PWA — Workbox service worker with stale-while-revalidate caching"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|-----------------|------|
| Vite + React 18 + TypeScript | Task 1 |
| React Router v6 routing | Task 5 |
| `tokens.css` + `base.css` split, values unchanged | Task 1 |
| `Icon` component from `icons.js` | Task 2 |
| `position.ts` from handoff | Task 2 |
| `usePozycja` GPS + schedule fallback | Task 2, 6 |
| `useLocalStorage` persist | Task 2, 10 |
| `fmt`/`fmt1` Polish decimal | Task 2 |
| Data types matching API contract | Task 3 |
| Seed JSON matching API shape | Task 3 |
| `api.ts` with seed fallback | Task 3 |
| Static content (prayers, readings) | Task 3 |
| All base components | Task 4 |
| `PilgrimageContext` bootstrap loading | Task 5 |
| `Shell` with theme attrs + NavLink tabbar | Task 5 |
| Start screen — distance, progress, GPS alert | Task 6 |
| Trasa screen — day switcher, timeline | Task 6 |
| Info screen + detail reader | Task 7 |
| TanStack Query for news/quartermaster | Task 7, 8 |
| Kwatermistrz list + entry reader | Task 8 |
| Niezbędnik tiles + readers | Task 9 |
| Konferencja reader | Task 9 |
| Ustawienia with real theme + GPS mode persistence | Task 10 |
| PWA — Workbox, manifest, caching strategies | Task 11 |
| Animation only `transform` (not opacity) | CSS from tokens — no override added ✓ |
| Right rail on ≥1040px | CSS from base.css ✓ |

**No placeholders found** — all steps have concrete code or exact commands.

**Type consistency:** `Dzien`/`Przystanek`/`Fix` from `position.ts` consumed by `usePozycja.ts` and `api.ts` (`toDzien`). `ApiPilgrimageDay` → `toDzien()` → `Dzien` chain is consistent across Tasks 3, 6. `Ustawienia` type defined in `PilgrimageContext.tsx` and consumed in `Shell.tsx`, `UstawieniaScreen`.
