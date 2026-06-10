import { useEffect, useState } from 'react';

const MINUTE_IN_MS = 60 * 1000;

export function useCurrentTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const syncToMinuteBoundary = () => {
      const delay = MINUTE_IN_MS - (Date.now() % MINUTE_IN_MS);

      timeoutId = setTimeout(() => {
        setNow(new Date());
        intervalId = setInterval(() => {
          setNow(new Date());
        }, MINUTE_IN_MS);
      }, delay);
    };

    syncToMinuteBoundary();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return now;
}
