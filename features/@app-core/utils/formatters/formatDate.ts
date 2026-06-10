const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const formatDate = (value: string) => {
  const normalizedValue = value.replace(/\s+/g, ' ').trim();
  const isoMatch = normalizedValue.match(ISO_DATE_PATTERN);

  if (!isoMatch) {
    return normalizedValue;
  }

  const [, year, month, day] = isoMatch;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day)
  ) {
    return normalizedValue;
  }

  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
};
