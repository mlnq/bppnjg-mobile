export function getScheduleSourceLabel(source: 'time-estimated' | 'gps') {
  if (source === 'gps') {
    return 'lokalizacji wg GPS';
  }

  return 'planu dnia';
}
