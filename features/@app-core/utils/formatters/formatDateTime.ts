const PL_LOCALE = 'pl-PL';

function toValidDate(value: string | Date | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  const date = value instanceof Date ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions,
  fallback: string
) {
  const date = toValidDate(value);

  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(PL_LOCALE, options).format(date);
}

export function formatDateShort(value: string | Date | null | undefined, fallback = 'Bez daty') {
  return formatDate(
    value,
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
    fallback
  );
}

export function formatDateTimeShort(
  value: string | Date | null | undefined,
  fallback = 'Bez daty'
) {
  return formatDate(
    value,
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    fallback
  );
}

export function formatDateLong(value: string | Date | null | undefined, fallback = 'Bez daty') {
  return formatDate(
    value,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    fallback
  );
}

export function formatHourMinute(value: string | Date | null | undefined, fallback = '--:--') {
  return formatDate(
    value,
    {
      hour: '2-digit',
      minute: '2-digit',
    },
    fallback
  );
}

export function formatDateTimeWithSeconds(
  value: string | Date | null | undefined,
  fallback = 'Brak'
) {
  return formatDate(
    value,
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
    fallback
  );
}
