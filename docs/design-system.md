# Design System

## Cel

Ten dokument opisuje aktualny kierunek wizualny aplikacji mobilnej BBPnJG po odświeżeniu UI.

To nie jest pełny rebranding ani nowy system od zera.
To ewolucja obecnego interfejsu:

- bardziej czytelna hierarchia
- lepsza użyteczność mobilna
- spójniejsze karty, badge'e i stany semantyczne
- spokojniejszy, cieplejszy charakter wizualny

---

## Design Principles

### 1. Hierarchy First

Interfejs ma prowadzić użytkownika przez treść za pomocą:

- rozmiaru
- grubości fontu
- koloru
- kontrastu
- odstępów

Najważniejsze informacje muszą być widoczne bez szukania ich po ekranie.

### 2. Touch Optimized

Aplikacja jest używana głównie na telefonie, często jedną ręką i w ruchu.

Dlatego:

- minimalny touch target to `44px`
- spacing ma być hojny
- elementy klikalne mają mieć czytelne granice
- nawigacja ma być łatwa do obsługi w terenie

### 3. High Contrast

Aplikacja ma pozostać czytelna:

- w słońcu
- w ruchu
- przy szybkim skanowaniu informacji

Oznacza to:

- mocny kontrast tekstu do tła
- ograniczenie dekoracyjności
- czytelne stany semantyczne

### 4. Warm & Calm

Kierunek wizualny jest ciepły, spokojny i lekko premium.

Paleta bazuje na:

- burgundzie
- bursztynie / złocie
- ciepłych neutralach

Ten zestaw ma przywoływać skojarzenia z:

- pielgrzymką
- mapą
- organizacją dnia
- terenowym, ale uporządkowanym doświadczeniem

### 5. Quick Access

Najważniejsze informacje mają być dostępne szybko, bez dodatkowych kliknięć.

Priorytet:

- szybkie rozpoznanie typu komunikatu
- czytelne sekcje
- jasny układ kart

---

## Paleta Kolorów

### Primary: Burgundy

Główny kolor marki i akcentów nagłówkowych.

- `50` `#F7EEF3`
- `100` `#F1DDE7`
- `200` `#E9C1D1`
- `600` `#842160`
- `700` `#6F1C52`

Użycie:

- nagłówki sekcji
- główne akcenty UI
- wybrane badge'e i CTA

### Accent: Amber / Gold

Kolor wspierający dla stanów ciepłych, przyjaznych i organizacyjnych.

- `50` `#FFF8E2`
- `100` `#FFEEB8`
- `200` `#FFE082`
- `500` `#FF9800`
- `600` `#ED7A00`

Użycie:

- akcenty informacyjne
- quartermaster
- highlighty i elementy wspierające

### Neutrals

Kolory bazowe do tła, kart i treści.

- `surface` `#FFFFFF`
- `surface-subtle` `#F7F8FA`
- `app-background` `#F3F5F8`
- `border-soft` `#E5E7EB`
- `text-primary` `#172033`
- `text-secondary` `#56637A`
- `text-muted` `#7C8798`

Użycie:

- tła ekranów
- standardowe karty
- tekst pomocniczy
- separatory

### Semantic

#### Medical

- tło: `#FDE8E6`
- border / accent: `#F7B8B3`
- tekst / ikona: `#C6453D`

Zastosowanie:

- komunikaty medyczne
- stany pilne zdrowotne
- medyczne badge'e i ikony

#### Test

- tło: `#F3ECFF`
- border / accent: `#DEC8FF`
- tekst / ikona: `#7A2CF3`

Zastosowanie:

- komunikaty testowe
- wpisy techniczne
- subtelne, ale czytelne odróżnienie od komunikatów operacyjnych

#### Success

- tło: `#DDF7E5`
- border / accent: `#BDECCB`
- tekst / ikona: `#14804A`

Zastosowanie:

- stany poprawne
- potwierdzenia
- statusy zakończone powodzeniem

#### Warning

- tło: `#FFF1BF`
- border / accent: `#F7D85A`
- tekst / ikona: `#B86A00`

Zastosowanie:

- ostrzeżenia
- ważne informacje organizacyjne
- stany wymagające uwagi, ale nie alarmowe

---

## Typografia

Typografia nie wymaga radykalnej zmiany.
Kierunek to uporządkowanie hierarchii i skali, przy zachowaniu obecnego charakteru aplikacji.

### Heading 1

Największe nagłówki ekranów i kluczowych sekcji dnia.

Przykład:

- `Białystok → Suraż`

Założenia:

- mocny kontrast
- wyraźna waga
- oszczędne użycie

### Heading 2

Nagłówki głównych bloków treści.

Przykład:

- `Harmonogram Dnia`

### Heading 3

Nagłówki kart i sekcji pomocniczych.

Przykład:

- `Komentarz kwatermistrza`

### Body

Podstawowy tekst treści i opisów.

Przykład:

- `Super ekstra! Daliście radę! Pierwszy dzień za nami 💪`

Założenia:

- wysoka czytelność
- naturalny line-height
- dobry kontrast względem tła

### Small

Krótki opis pomocniczy lub zapowiedź treści.

Przykład:

- `Krótka zapowiedź tematów dnia`

### Extra Small

Metadane i etykiety pomocnicze.

Przykład:

- `DZIEŃ 1 • 28.04.2026`

Użycie:

- daty
- meta informacji
- statusy wtórne

---

## Cards

Karty są podstawowym budulcem aplikacji.
Mają porządkować treści i wzmacniać hierarchię bez wizualnego przeciążenia.

### Default Card

Standardowa karta do większości treści.

Cechy:

- jasne tło
- delikatny cień
- subtelny border lub brak bordera
- zaokrąglone rogi

Użycie:

- news
- sekcje na home
- podstawowe treści informacyjne

### Elevated Card

Karta o wyższym priorytecie wizualnym.

Cechy:

- mocniejszy cień
- bardziej wyraźna separacja od tła
- większy nacisk na treść

Użycie:

- wyróżnione sekcje
- hero content
- ważniejsze bloki dnia

### Medical Card

Karta dla treści medycznych i pilnych zdrowotnie.

Cechy:

- jasnoczerwone / różowe tło
- czerwony akcent
- medyczna ikonografia
- wysoka widoczność

Użycie:

- komunikaty medyczne
- alerty zdrowotne
- ważne informacje o pomocy medycznej

### Test Card

Karta dla komunikatów technicznych i testowych.

Cechy:

- subtelne fioletowe tło
- lekko odseparowany stan wizualny
- ma być odróżnialna, ale nie alarmowa

Użycie:

- test push
- wiadomości techniczne
- stany nieoperacyjne

### Quartermaster Card

Karta dla komentarzy i komunikatów kwatermistrza.

Cechy:

- ciepły bursztynowy odcień
- bardziej "terenowy" i organizacyjny charakter
- przyjazna, ale czytelna tonacja

Użycie:

- komentarze kwatermistrza
- ważne informacje organizacyjne
- bieżące komunikaty dnia

---

## Badges

Badge'e służą do szybkiego rozpoznania typu treści lub stanu.
Powinny być krótkie, czytelne i konsekwentne.

### Warianty semantyczne

- `Default`
- `Primary`
- `Medical`
- `Test`
- `Warning`
- `Success`

### Rozmiary

- `Small`
- `Medium`
- `Large`

### Zasady użycia

- badge nie zastępuje nagłówka, tylko go wspiera
- używamy krótkich etykiet
- kolor badge'a musi odpowiadać semantyce treści
- badge ma pomagać w skanowaniu listy, nie dominować nad całą kartą

Przykładowe etykiety:

- `Medyczne`
- `Test`
- `Pilne`
- `Organizator`
- `Kwatermistrz`

---

## Ikonografia

Ikony mają być proste, rozpoznawalne i semantyczne.
Nie powinny wyglądać dekoracyjnie.

Zasady:

- jedna ikona = jedno znaczenie
- priorytet ma czytelność, nie ozdobność
- komunikaty operacyjne i specjalne stany powinny mieć różne ikony, jeśli poprawia to rozpoznawalność

Przykłady:

- komunikaty ogólne: megafon / campaign
- medical: czerwony plus
- test: laboratoryjny lub techniczny symbol
- quartermaster: ikona organizacyjna / ostrzegawcza / terenowa

---

## Spacing i Promienie

### Spacing

System spacingu powinien wspierać rytm pionowy i wygodne skanowanie.

Rekomendacja:

- `4`
- `8`
- `12`
- `16`
- `20`
- `24`
- `32`

### Border Radius

Interfejs ma być miękki, ale nie przesadnie zaokrąglony.

Rekomendacja:

- badge: `999`
- małe elementy: `12`
- standard card: `20-24`
- większe surface / sections: `24-28`

---

## Zastosowanie w aplikacji

### Home

- najwyższy nacisk na hierarchię i szybki przegląd dnia
- ważne sekcje mają być widoczne bez chaosu
- karty powinny mieć czytelne priorytety

### Info

- typ komunikatu ma być widoczny od razu
- stany `medical`, `test`, `quartermaster` i zwykłe wpisy powinny być łatwe do odróżnienia
- lista powinna wspierać szybkie skanowanie

### Trasa

- priorytet dla czytelności etapów, punktów i postępu dnia
- akcenty tylko tam, gdzie wzmacniają orientację

### Modlitwy i konferencje

- większy nacisk na treść i wygodne czytanie
- spokojniejsze tła
- mniej semantycznego "hałasu"

---

## Zakres zmian

Ten design system należy traktować jako:

- refinement istniejącej aplikacji
- uporządkowanie komponentów
- poprawę hierarchii i spójności

Nie zakłada on:

- pełnego rebrandingu
- całkowitej zmiany typografii
- tworzenia zupełnie nowego produktu wizualnie
