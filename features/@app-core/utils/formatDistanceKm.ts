export const formatDistanceKm = (distanceKm: number) => {
  const formatted = new Intl.NumberFormat('pl-PL', {
    style: 'unit',
    unit: 'kilometer',
    unitDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(distanceKm);

  return formatted.replace(/km$/, '\u00A0km');
};
