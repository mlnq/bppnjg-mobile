export type ParsedMassReadingReference = {
  book: string;
  chapter: number;
  verses: string;
  label: string;
};

const BOOK_NAME_TO_BT_ABBREVIATION: Record<string, string> = {
  acts: 'dz',
  amos: 'am',
  baruch: 'ba',
  colossians: 'kol',
  daniel: 'dn',
  deuteronomy: 'pwt',
  ecclesiastes: 'koh',
  ephesians: 'ef',
  esther: 'est',
  exodus: 'wj',
  ezekiel: 'ez',
  ezra: 'ezd',
  galatians: 'gal',
  genesis: 'rdz',
  habakkuk: 'ha',
  hebrews: 'hebr',
  hosea: 'oz',
  isaiah: 'iz',
  james: 'jak',
  jeremiah: 'jr',
  job: 'hi',
  joel: 'jl',
  john: 'jan',
  jonah: 'jon',
  joshua: 'joz',
  jude: 'jud',
  judges: 'sdz',
  lamentations: 'lm',
  leviticus: 'kpl',
  luke: 'luk',
  malachi: 'ml',
  mark: 'mar',
  matthew: 'mat',
  micah: 'mi',
  nahum: 'na',
  nehemiah: 'ne',
  numbers: 'lb',
  obadiah: 'ab',
  philippians: 'fil',
  philemon: 'flm',
  proverbs: 'prz',
  psalm: 'ps',
  psalms: 'ps',
  revelation: 'obj',
  romans: 'rz',
  ruth: 'rt',
  sirach: 'syr',
  songofsolomon: 'pnp',
  songofsongs: 'pnp',
  titus: 'tyt',
  wisdom: 'mdr',
  zechariah: 'za',
  zephaniah: 'so',
};

function normalizeBookName(bookName: string) {
  return bookName.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeVerses(verses: string) {
  const collapsed = verses.replace(/\s+/g, '');

  if (collapsed.includes(',')) {
    return undefined;
  }

  return collapsed.replace(/[a-z]/gi, '');
}

function mapOrdinalBook(reference: string) {
  const normalized = normalizeBookName(reference);

  if (normalized.startsWith('1corinthians')) {
    return '1kor';
  }

  if (normalized.startsWith('2corinthians')) {
    return '2kor';
  }

  if (normalized.startsWith('1john')) {
    return '1j';
  }

  if (normalized.startsWith('2john')) {
    return '2j';
  }

  if (normalized.startsWith('3john')) {
    return '3j';
  }

  if (normalized.startsWith('1kings')) {
    return '1krl';
  }

  if (normalized.startsWith('2kings')) {
    return '2krl';
  }

  if (normalized.startsWith('1chronicles')) {
    return '1krn';
  }

  if (normalized.startsWith('2chronicles')) {
    return '2krn';
  }

  if (normalized.startsWith('1maccabees')) {
    return '1mch';
  }

  if (normalized.startsWith('2maccabees')) {
    return '2mch';
  }

  if (normalized.startsWith('1peter')) {
    return '1p';
  }

  if (normalized.startsWith('2peter')) {
    return '2p';
  }

  if (normalized.startsWith('1samuel')) {
    return '1sm';
  }

  if (normalized.startsWith('2samuel')) {
    return '2sm';
  }

  if (normalized.startsWith('1thessalonians')) {
    return '1tes';
  }

  if (normalized.startsWith('2thessalonians')) {
    return '2tes';
  }

  if (normalized.startsWith('1timothy')) {
    return '1tym';
  }

  if (normalized.startsWith('2timothy')) {
    return '2tym';
  }

  return undefined;
}

export function parseMassReadingReference(
  reference: string | undefined
): ParsedMassReadingReference | undefined {
  if (!reference) {
    return undefined;
  }

  const match = reference.match(/^(.+?)\s+(\d+):(.+)$/);

  if (!match) {
    return undefined;
  }

  const [, bookName, chapter, versesPart] = match;
  const verses = normalizeVerses(versesPart);

  if (!verses) {
    return undefined;
  }

  const ordinalBook = mapOrdinalBook(bookName);
  const baseBook =
    ordinalBook ?? BOOK_NAME_TO_BT_ABBREVIATION[normalizeBookName(bookName)];

  if (!baseBook) {
    return undefined;
  }

  return {
    book: baseBook,
    chapter: Number(chapter),
    verses,
    label: reference,
  };
}
