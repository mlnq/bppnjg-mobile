export function getScheduleSourceLabel(source: 'time-estimated' | 'gps') {
  if (source === 'gps') {
    return 'GPS';
  }

  return 'planu dnia';
}
