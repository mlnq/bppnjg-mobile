import type { ReadingFontScale } from './ReadingFontSizeControl';

export function getReadingFontSizeLabel(scale: ReadingFontScale) {
  if (scale === 1) {
    return 'A';
  }

  if (scale === 1.15) {
    return 'A+';
  }

  return 'A++';
}
