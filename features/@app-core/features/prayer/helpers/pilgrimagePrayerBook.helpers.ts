import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import godzinkiContent from '../content/godzinki.md';
import litaniaLoretanskaContent from '../content/litania-loretanska.md';
import litaniaSerceJezusoweContent from '../content/litania-serce-jezusowe.md';
import tajemniceRozancoweContent from '../content/tajemnice-rozancowe.md';

export type PrayerBookEntryId =
  | 'godzinki'
  | 'rosary-mysteries'
  | 'litany-loreto'
  | 'litany-sacred-heart';

export type PrayerBookEntry = {
  id: PrayerBookEntryId;
  title: string;
  subtitle: string;
  contentModule: number;
};

export const PRAYER_BOOK_ENTRIES: readonly PrayerBookEntry[] = [
  {
    id: 'godzinki',
    title: 'Godzinki o Niepokalanym Poczęciu NMP',
    subtitle: 'Układ modlitwy na kolejne godziny dnia',
    contentModule: godzinkiContent,
  },
  {
    id: 'rosary-mysteries',
    title: 'Tajemnice różańcowe',
    subtitle: 'Wszystkie części różańca w jednym miejscu',
    contentModule: tajemniceRozancoweContent,
  },
  {
    id: 'litany-loreto',
    title: 'Litania Loretańska',
    subtitle: 'Litania do Najświętszej Maryi Panny',
    contentModule: litaniaLoretanskaContent,
  },
  {
    id: 'litany-sacred-heart',
    title: 'Litania do Najświętszego Serca Pana Jezusa',
    subtitle: 'Tradycyjna modlitwa wynagrodzenia i zawierzenia',
    contentModule: litaniaSerceJezusoweContent,
  },
] as const;

export function getPrayerBookEntryById(entryId: PrayerBookEntryId) {
  return PRAYER_BOOK_ENTRIES.find((entry) => entry.id === entryId);
}

export async function loadPrayerBookEntryBody(entryId: PrayerBookEntryId) {
  const entry = getPrayerBookEntryById(entryId);

  if (!entry) {
    throw new Error('Nie znaleziono wybranej modlitwy.');
  }

  const asset = Asset.fromModule(entry.contentModule);
  await asset.downloadAsync();

  const fileUri = asset.localUri ?? asset.uri;

  if (!fileUri) {
    throw new Error('Nie udało się odczytać pliku markdown z modlitwą.');
  }

  return FileSystem.readAsStringAsync(fileUri);
}
