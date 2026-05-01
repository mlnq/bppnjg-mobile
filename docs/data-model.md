# Model Danych

## Cel

Model danych ma obsłużyć trzy warstwy jednocześnie:

- aplikację mobilną `offline-first`
- przyszłe REST API
- panel administracyjny do edycji treści

Założenie operacyjne:

- aplikacja startuje z danych z bundle
- po uruchomieniu synchronizuje dane z API
- przy braku zasięgu korzysta z ostatniej zapisanej wersji lokalnej

---

## Zasady modelu

### 1. Stabilne identyfikatory

Każdy byt ma stałe `id`, które nie zmienia się między wersjami.

Przykłady:

- `route_2025_main`
- `day_01`
- `stop_day01_03`
- `conference_day_01`
- `news_2025_07_30_001`

### 2. Wersjonowanie

Każdy byt synchronizowany z backendem ma:

- `version`
- `updatedAt`
- opcjonalnie `isArchived`

To pozwala mobile zdecydować, czy lokalna wersja jest aktualna.

### 3. Rozdzielenie bytów statycznych i dynamicznych

Domyślnie offline:

- trasy
- dni
- postoje
- kościoły
- modlitwy
- śpiewnik
- konferencje
- kolejność grup
- assety fallback

Dynamiczne lub możliwe do aktualizacji online:

- wieści
- komentarze kwatermistrza
- aktualizacje tras
- aktualizacje konferencji
- aktualizacje kolejności grup

### 4. Assety jako referencje

Byty nie trzymają bezpośrednio obrazków. Trzymają `assetKey`, a osobny byt `MediaAsset`
mapuje ten klucz na plik SVG, PNG, PDF albo audio.

---

## Główne byty

### `PilgrimageRoute`

Główny byt wydarzenia.

Najważniejsze pola:

- `id`
- `code`
- `name`
- `year`
- `startDate`
- `endDate`
- `totalDays`
- `totalDistanceKm`
- `destinationTownName`

Relacje:

- `PilgrimageRoute 1 -> N PilgrimageDay`

### `PilgrimageDay`

Jednostka dzienna pielgrzymki.

Najważniejsze pola:

- `routeId`
- `dayNumber`
- `date`
- `title`
- `theme`
- `distanceKm`
- `scheduledStartTime`
- `plannedArrivalTime`
- `startTownName`
- `endTownName`
- `leadAssetKey`

Relacje:

- `PilgrimageDay N -> 1 PilgrimageRoute`
- `PilgrimageDay 1 -> N DayStop`
- `PilgrimageDay 1 -> 1 Conference`
- `PilgrimageDay 1 -> 1 GroupOrder`
- `PilgrimageDay 1 -> 0..1 Reflection`
- `PilgrimageDay 1 -> N NewsItem`

### `DayStop`

Punkt na trasie dnia. Może oznaczać kościół, postój, nocleg, punkt medyczny, waypoint.

Najważniejsze pola:

- `dayId`
- `orderIndex`
- `type`
- `name`
- `townName`
- `scheduledAt`
- `distanceFromStartKm`
- `distanceToNextKm`
- `location`
- `assetKey`

Relacje:

- `DayStop N -> 1 PilgrimageDay`

### `Conference`

Konferencja dnia publikowana na `Start` i na ekranie szczegółowym.

Najważniejsze pola:

- `dayId`
- `dayNumber`
- `state`
- `sectionTitle`
- `badgeLabel`
- `title`
- `lead`
- `summary`
- `speaker`
- `durationMin`
- `audioUrl`
- `coverAssetKey`
- `content[]`

`content` jest blokowe, żeby obsłużyć:

- sekcje tekstowe
- cytaty
- listy punktowane

### `NewsItem`

Ogólny komunikat redakcyjny.

Najważniejsze pola:

- `category`
- `title`
- `summary`
- `content`
- `publishedAt`
- `expiresAt`
- `isPinned`
- `deeplink`
- `dayId`

### `QuartermasterComment`

Osobny byt dla szybkich komunikatów operacyjnych.

Najważniejsze pola:

- `title`
- `content`
- `priority`
- `publishedAt`
- `expiresAt`
- `deeplink`
- `dayId`

Powód wydzielenia:

- inna semantyka niż news
- inny priorytet
- łatwiejsze powiązanie z push i dashboardem

### `GroupOrder`

Kolejność grup na dany dzień.

Najważniejsze pola:

- `dayId`
- `dayNumber`
- `entries[]`

Każdy wpis zawiera:

- `position`
- `groupCode`
- `groupName`
- `description`

### `Prayer`

Treści modlitewne offline.

Najważniejsze pola:

- `slug`
- `title`
- `category`
- `contentFormat`
- `content`
- `excerpt`

### `Songbook`

Kontener na śpiewnik.

Najważniejsze pola:

- `title`
- `format`
- `coverAssetKey`
- `fileUrl`

Jeśli śpiewnik zostanie rozbity na pojedyncze utwory, wtedy dochodzi byt `Song`.

### `Song`

Pieśń ze śpiewnika.

Najważniejsze pola:

- `songbookId`
- `slug`
- `title`
- `category`
- `lyricsFormat`
- `lyrics`
- `source`
- `orderIndex`

### `MediaAsset`

Ogólny rejestr assetów.

Najważniejsze pola:

- `key`
- `kind`
- `targetType`
- `title`
- `fileUrl`
- `thumbnailUrl`
- `mimeType`

Przykłady użycia:

- ilustracja kościoła
- fallback SVG postoju
- PDF śpiewnika
- audio konferencji

---

## Relacje wysokiego poziomu

```txt
PilgrimageRoute
  -> PilgrimageDay[]

PilgrimageDay
  -> DayStop[]
  -> Conference?
  -> GroupOrder?
  -> Reflection?
  -> NewsItem[]
  -> QuartermasterComment[]

DayStop
  -> MediaAsset?

Conference
  -> MediaAsset?

Songbook
  -> Song[]
  -> MediaAsset?
```

---

## Model offline cache

Po stronie mobilnej każdy zasób powinien być zapisany lokalnie w kopercie:

- `scope`: `bundle | remote | cache`
- `syncedAt`
- `items`

To rozróżnia:

- dane wbudowane w aplikację
- dane pobrane z API
- dane odtworzone z lokalnego storage

---

## Minimalne decyzje wdrożeniowe

### Na MVP

- `Conference` jako pełny tekst i opcjonalnie audio
- `QuartermasterComment` jako osobny byt
- `Songbook` najpierw jako `pdf`
- `Song` dopiero po rozbiciu śpiewnika
- `DayStop.assetKey` pod ilustracje AI

### Na później

- wielojęzyczność przez `LocalizedText`
- uprawnienia użytkowników i rejestracja
- segmentacja newsów po grupach
- przypisanie komentarzy kwatermistrza do konkretnego odcinka, nie tylko dnia

---

## Plik źródłowy typów

Implementacja TypeScript tego modelu znajduje się w:

- `features/@app-core/models/pilgrimageDataModel.ts`
