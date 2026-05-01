export type BiblePassageReference = {
  book: string;
  chapter: number;
  verses: string;
  label: string;
};

const HOME_BIBLE_PASSAGES: readonly BiblePassageReference[] = [
  { book: 'ps', chapter: 23, verses: '1-3', label: 'Ps 23,1-3' },
  { book: 'j', chapter: 3, verses: '16', label: 'J 3,16' },
  { book: 'rz', chapter: 8, verses: '28', label: 'Rz 8,28' },
  { book: 'flp', chapter: 4, verses: '6-7', label: 'Flp 4,6-7' },
  { book: 'iz', chapter: 41, verses: '10', label: 'Iz 41,10' },
  { book: 'mt', chapter: 11, verses: '28-30', label: 'Mt 11,28-30' },
  { book: '1kor', chapter: 13, verses: '4-7', label: '1 Kor 13,4-7' },
  { book: '2tm', chapter: 1, verses: '7', label: '2 Tm 1,7' },
] as const;

function getDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function getDailyBiblePassage(date = new Date()): BiblePassageReference {
  const dayKey = getDayKey(date);
  const randomIndex = hashString(dayKey) % HOME_BIBLE_PASSAGES.length;

  return HOME_BIBLE_PASSAGES[randomIndex] ?? HOME_BIBLE_PASSAGES[0];
}
