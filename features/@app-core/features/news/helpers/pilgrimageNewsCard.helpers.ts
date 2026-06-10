import { formatDateTimeShort } from '../../../utils/formatters/formatDateTime';

export function formatPilgrimageNewsPublishedAt(value: string) {
  return formatDateTimeShort(value);
}
