import type { BreviaryOfficeId } from '../../../services/brewiarzApi';

export const DEFAULT_BREVIARY_OFFICE: BreviaryOfficeId = 'jutrznia';

export const OFFICE_OPTIONS: readonly { id: BreviaryOfficeId; label: string }[] = [
  { id: 'godzina-czytan', label: 'Godz. czytan' },
  { id: DEFAULT_BREVIARY_OFFICE, label: 'Jutrznia' },
  { id: 'modlitwa-przedpoludniowa', label: 'Przed poludniem' },
  { id: 'modlitwa-poludniowa', label: 'W poludnie' },
  { id: 'modlitwa-popoludniowa', label: 'Po poludniu' },
  { id: 'nieszpory', label: 'Nieszpory' },
  { id: 'kompleta', label: 'Kompleta' },
] as const;

function escapeMarkdownText(value: string) {
  return value.replace(/([\\`*_{}[\]()#+\-!.|>])/g, '\\$1');
}

function leadingWhitespaceToTabs(leadingWhitespace: string) {
  const normalizedWhitespace = leadingWhitespace.replace(/\t/g, '    ');
  const indentLevel = Math.max(1, Math.ceil(normalizedWhitespace.length / 2));

  return '\u2003'.repeat(indentLevel);
}

function formatHighlightedLine(line: string) {
  const trimmedLine = line.trimStart();

  if (
    /^(?:Antyfony\s*-\s*)?LG tom /i.test(trimmedLine) ||
    /^(?:Psalmy\s*-\s*)?LG tom /i.test(trimmedLine)
  ) {
    return `**${escapeMarkdownText(trimmedLine)}**`;
  }

  if (/^[IVXLCDM]+\s*$/i.test(trimmedLine)) {
    return `**${escapeMarkdownText(trimmedLine)}**`;
  }

  let formattedLine = trimmedLine.replace(
    /^(\d+)(?=\s|&nbsp;|\u00a0|$)/,
    (_match, digits: string) => `**${digits}**`
  );

  formattedLine = formattedLine.replace(
    /\b(K\.|W\.|Ant\.)/g,
    (_match, marker: string) => `**${marker}**`
  );

  return escapeMarkdownText(formattedLine)
    .replace(/\\\*\\\*(.+?)\\\*\\\*/g, '**$1**')
    .replace(/†/g, '**†**');
}

export function bodyToMarkdown(body: string) {
  const normalizedBody = body
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n\s*\n+/g, '\n');

  return normalizedBody
    .split('\n')
    .map((line) => {
      const leadingWhitespace = line.match(/^\s+/)?.[0] ?? '';
      const preservedIndentation = leadingWhitespaceToTabs(leadingWhitespace);
      const escapedLine = formatHighlightedLine(line);

      return `${preservedIndentation}${escapedLine || '\u00a0'}`;
    })
    .join('  \n');
}
