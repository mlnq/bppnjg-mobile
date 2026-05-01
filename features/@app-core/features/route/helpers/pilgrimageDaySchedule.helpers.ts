import type { PilgrimageDayScheduleItem } from '../../../constants/pilgrimageRoute';

export type ScheduleItemIconName =
  | 'walk'
  | 'timer'
  | 'meal'
  | 'church'
  | 'medical'
  | 'prayer'
  | 'bedtime'
  | 'info';

export function getScheduleItemIconName(item: PilgrimageDayScheduleItem): ScheduleItemIconName {
  if (item.type === 'start') {
    return 'walk';
  }

  if (item.type === 'rest') {
    return 'timer';
  }

  if (item.type === 'meal') {
    return 'meal';
  }

  if (item.type === 'mass') {
    return 'church';
  }

  if (item.type === 'medical') {
    return 'medical';
  }

  if (item.type === 'prayer') {
    return 'prayer';
  }

  if (item.type === 'night') {
    return 'bedtime';
  }

  return 'info';
}
