# Panel Administratora MVP

## Cel

Panel administratora ma służyć do zarządzania komunikacją do pielgrzymów.  
Na etapie MVP panel obsługuje wyłącznie wysyłkę powiadomień push do aplikacji mobilnej.

Docelowy stack:

- `Next.js`
- prosty backend w `Next.js Route Handlers` lub `Server Actions`
- integracja z `Expo Push API`
- później możliwość rozszerzenia o bazę danych i historię komunikatów

---

## Zakres MVP

### Funkcje

- logowanie administratora
- formularz wysyłki push notyfikacji
- podgląd payloadu przed wysyłką
- wybór typu komunikatu
- opcjonalne przekierowanie użytkownika do konkretnego widoku w aplikacji
- zapis wysłanego komunikatu do historii

### Poza MVP

- segmentacja odbiorców
- harmonogram wysyłek
- edycja lub cofanie komunikatów
- upload grafik
- analityka otwarć
- role i wielu administratorów

---

## Widoki

### 1. Logowanie

Minimalny ekran:

- `email`
- `hasło`
- przycisk `Zaloguj`

Na start można użyć:

- `NextAuth`
- albo prostego logowania przez hasło panelowe trzymane w env

### 2. Dashboard

Minimalny dashboard:

- liczba wysłanych komunikatów dzisiaj
- ostatni wysłany komunikat
- przycisk `Nowe powiadomienie`

### 3. Nowe powiadomienie

Najważniejszy ekran MVP.

Pola:

- `Tytuł`
- `Treść`
- `Kategoria`
  - `announcement`
  - `logistics`
  - `spiritual`
  - `weather`
- `Ekran docelowy`
  - `news`
  - opcjonalnie później inne widoki
- `Przypięte`
  - `true/false`
- `ID wiadomości`
  - generowane automatycznie

Przyciski:

- `Podgląd`
- `Wyślij test`
- `Wyślij do wszystkich`

### 4. Historia wysyłek

Lista wysłanych komunikatów:

- data i godzina
- tytuł
- treść skrócona
- status
- liczba ticketów / odpowiedzi Expo

Na MVP wystarczy read-only lista.

---

## Payload powiadomienia

Proponowany payload zgodny z aplikacją:

```json
{
  "to": ["ExponentPushToken[...]", "ExponentPushToken[...]"],
  "title": "Zmiana miejsca postoju",
  "body": "Postój obiadowy został przeniesiony o 2 km dalej.",
  "sound": "default",
  "data": {
    "screen": "news",
    "category": "logistics",
    "isPinned": true,
    "newsId": "news-2026-04-26-001",
    "publishedAt": "2026-04-26T12:30:00.000Z"
  }
}
```

To pasuje do obecnej aplikacji, bo:

- push może przekierować do `Wieści`
- lokalny zapis w appce używa `category`, `isPinned`, `newsId`, `publishedAt`

---

## Architektura Next.js

### Frontend

Struktura robocza:

```txt
app/
  login/page.tsx
  dashboard/page.tsx
  notifications/new/page.tsx
  notifications/history/page.tsx
  api/
    notifications/send/route.ts
    notifications/history/route.ts
lib/
  expo-push.ts
  auth.ts
  validation.ts
```

### Backend

Minimalne endpointy:

- `POST /api/notifications/send`
- `GET /api/notifications/history`

### Warstwa integracji

`lib/expo-push.ts`

Odpowiada za:

- budowę payloadu
- wysyłkę do `https://exp.host/--/api/v2/push/send`
- pobranie ticketów
- logowanie odpowiedzi

---

## Model danych

Na MVP można zacząć od jednej tabeli.

### Tabela `admin_notifications`

- `id`
- `title`
- `body`
- `category`
- `screen`
- `is_pinned`
- `published_at`
- `status`
- `created_by`
- `created_at`
- `expo_ticket_response`

Jeśli na start nie chcesz jeszcze bazy:

- można trzymać historię chwilowo w `SQLite`, `Supabase` albo nawet w pliku JSON po stronie panelu
- ale docelowo sensowniejsza będzie zwykła baza SQL

---

## Integracja z aplikacją mobilną

Panel powinien docelowo obsłużyć dwa byty:

### 1. Rejestr urządzeń

Tabela `push_tokens`

- `id`
- `expo_push_token`
- `platform`
- `app_version`
- `created_at`
- `last_seen_at`
- `is_active`

### 2. Wysłane komunikaty

Tabela `admin_notifications`

To pozwoli później:

- wysyłać do wszystkich aktywnych urządzeń
- filtrować nieaktywne tokeny
- budować historię wysyłek

---

## UX draft

### Formularz wysyłki

Układ prosty, jednostronicowy:

- nagłówek `Nowe powiadomienie`
- formularz po lewej
- podgląd telefonu po prawej na desktopie
- na mobile podgląd pod formularzem

Sekcje:

1. `Treść komunikatu`
2. `Zachowanie w aplikacji`
3. `Podgląd`
4. `Akcja wysyłki`

### Podgląd telefonu

Pokazuje:

- wygląd notyfikacji systemowej
- jak wpis trafi do zakładki `Wieści`

---

## Bezpieczeństwo

Minimalne wymagania:

- panel za logowaniem
- sekret Expo po stronie serwera, nigdy w kliencie
- walidacja inputu na backendzie
- rate limit na endpoint wysyłki
- audit log kto i kiedy wysłał komunikat

---

## Kolejność wdrożenia

### Etap 1

- router i layout panelu
- logowanie
- formularz wysyłki
- endpoint wysyłki do Expo

### Etap 2

- historia wysyłek
- tabela tokenów
- zapis komunikatów do bazy

### Etap 3

- segmenty odbiorców
- planowanie wysyłki
- retry nieudanych notyfikacji

---

## Rekomendacja techniczna

Na dziś najrozsądniejszy wariant:

- `Next.js App Router`
- `NextAuth` albo proste hasło administracyjne na start
- `Postgres` lub `Supabase Postgres`
- wysyłka przez `Expo Push API`

To da prosty panel, który później łatwo rozszerzyć o:

- zarządzanie wieściami
- konferencje dnia
- treści modlitewnika
- harmonogram komunikatów
