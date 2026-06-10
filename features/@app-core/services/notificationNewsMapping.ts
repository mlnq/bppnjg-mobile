import type { PilgrimageNewsCategory, PilgrimagePushType } from '../constants/pilgrimageRoute';

const NEWS_CATEGORIES: readonly PilgrimageNewsCategory[] = [
  'announcement',
  'logistics',
  'spiritual',
  'weather',
];
const PUSH_TYPES: readonly PilgrimagePushType[] = [
  'announcement',
  'logistics',
  'spiritual',
  'weather',
  'medical',
  'general',
  'quartermaster',
  'test',
];

export function mapNotificationNewsCategory(value: unknown): PilgrimageNewsCategory {
  if (typeof value !== 'string') {
    return 'announcement';
  }

  if (value === 'medical' || value === 'quartermaster') {
    return 'logistics';
  }

  if (value === 'general' || value === 'test') {
    return 'announcement';
  }

  return NEWS_CATEGORIES.includes(value as PilgrimageNewsCategory)
    ? (value as PilgrimageNewsCategory)
    : 'announcement';
}

export function mapNotificationPushType(value: unknown): PilgrimagePushType | undefined {
  return typeof value === 'string' && PUSH_TYPES.includes(value as PilgrimagePushType)
    ? (value as PilgrimagePushType)
    : undefined;
}
