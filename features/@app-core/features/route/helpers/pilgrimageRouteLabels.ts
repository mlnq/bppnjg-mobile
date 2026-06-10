import type { PilgrimageDay } from '../../../constants/pilgrimageRoute';

function isGenericTownLabel(value?: string | null) {
  if (!value) {
    return true;
  }

  return (
    /^Punkt dnia \d+\.\d+$/i.test(value) ||
    /^Punkt \d+$/i.test(value) ||
    /^Waypoint \d+$/i.test(value)
  );
}

export function getPilgrimageRouteLabels(day: PilgrimageDay) {
  const startStop = day.schedule[0];
  const endStop = day.schedule[day.schedule.length - 1];
  const titleParts = day.title.split(/\s+[–-]\s+/);
  const titleStart = titleParts[0]?.trim();
  const titleEnd = titleParts[1]?.trim();

  return {
    startLabel: isGenericTownLabel(startStop?.townName)
      ? titleStart || 'Brak startu'
      : startStop?.townName || startStop?.name || 'Brak startu',
    endLabel: isGenericTownLabel(endStop?.townName)
      ? titleEnd || 'Brak celu dnia'
      : endStop?.townName || endStop?.name || 'Brak celu dnia',
  };
}
