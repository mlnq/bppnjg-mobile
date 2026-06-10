export const formatDistanceKm = (distanceKm: number) => {
  const roundedDistanceKm = Math.round(distanceKm * 100) / 100;
  const formatted = new Intl.NumberFormat('pl-PL', {
    style: 'unit',
    unit: 'kilometer',
    unitDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(roundedDistanceKm);

  return formatted.replace(/km$/, '\u00A0km');
};
