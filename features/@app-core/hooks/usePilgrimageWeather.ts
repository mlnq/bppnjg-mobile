import { useEffect, useState } from 'react';

import type { PilgrimageWeather } from '../constants/pilgrimageRoute';
import {
  PILGRIMAGE_YEAR,
  useGetPilgrimageDayQuery,
  useGetPilgrimageQuery,
} from '../services/pilgrimageApi';
import { getCurrentPilgrimageDayFetchNumber } from './useSelectedPilgrimageDay';
import { useUserLocation } from './useUserLocation';
import { getCurrentRouteLocation } from '../utils/pilgrimageCurrentLocation';

type OpenMeteoWeatherResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    is_day?: number;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    weather_code?: number[];
    is_day?: number[];
  };
};

type WeatherSource = 'gps' | 'time-estimated' | 'fallback';

export type PilgrimageHourlyWeatherItem = {
  time: string;
  temperatureC: number;
  summary: string;
  icon: PilgrimageWeather['icon'];
  isDay: boolean;
};

type UsePilgrimageWeatherResult = {
  weather: PilgrimageWeather;
  hourlyForecast: PilgrimageHourlyWeatherItem[];
  isLoading: boolean;
  error: string | null;
  source: WeatherSource;
};

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_WEATHER: PilgrimageWeather = {
  temperatureC: 0,
  summary: 'Prognoza chwilowo niedostepna.',
  icon: 'partlyCloudy',
};

function mapWeatherCodeToWeather(
  code: number | undefined,
  temperatureC: number,
  isDay = true
): PilgrimageWeather {
  if (code === 0) {
    return { temperatureC, summary: isDay ? 'Słonecznie' : 'Bezchmurnie', icon: 'sunny' };
  }

  if (code === 1 || code === 2) {
    return { temperatureC, summary: 'Częściowe zachmurzenie', icon: 'partlyCloudy' };
  }

  if (code === 3 || code === 45 || code === 48) {
    return { temperatureC, summary: 'Pochmurno', icon: 'cloudy' };
  }

  if (
    code === 51 ||
    code === 53 ||
    code === 55 ||
    code === 56 ||
    code === 57 ||
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 66 ||
    code === 67 ||
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return { temperatureC, summary: 'Deszcz na trasie', icon: 'rain' };
  }

  if (code === 95 || code === 96 || code === 99) {
    return { temperatureC, summary: 'Burze w okolicy', icon: 'storm' };
  }

  if (
    code === 71 ||
    code === 73 ||
    code === 75 ||
    code === 77 ||
    code === 85 ||
    code === 86
  ) {
    return { temperatureC, summary: 'Opady mieszane lub śnieg', icon: 'cloudy' };
  }

  return { temperatureC, summary: 'Warunki zmienne', icon: 'partlyCloudy' };
}

function buildHourlyForecast(hourly: OpenMeteoWeatherResponse['hourly']) {
  if (!hourly?.time || !hourly.temperature_2m || !hourly.weather_code) {
    return [];
  }

  const now = Date.now();

  return hourly.time
    .map((time, index) => {
      const timestamp = Date.parse(time);

      if (Number.isNaN(timestamp) || timestamp < now) {
        return null;
      }

      const temperature = hourly.temperature_2m?.[index];

      if (typeof temperature !== 'number' || Number.isNaN(temperature)) {
        return null;
      }

      const isDay = hourly.is_day?.[index] !== 0;
      const mappedWeather = mapWeatherCodeToWeather(
        hourly.weather_code?.[index],
        Math.round(temperature),
        isDay
      );

      return {
        time,
        temperatureC: mappedWeather.temperatureC,
        summary: mappedWeather.summary,
        icon: mappedWeather.icon,
        isDay,
      };
    })
    .filter((item): item is PilgrimageHourlyWeatherItem => item !== null)
    .slice(0, 12);
}

export function usePilgrimageWeather(): UsePilgrimageWeatherResult {
  const { currentLocation, locationSource } = useUserLocation();
  const {
    data: pilgrimage,
    isLoading: isPilgrimageLoading,
    isFetching: isPilgrimageFetching,
  } = useGetPilgrimageQuery(PILGRIMAGE_YEAR);
  const currentDayFetchNumber = getCurrentPilgrimageDayFetchNumber(pilgrimage?.totalDays);
  const {
    data: pilgrimageDay,
    isLoading: isDayLoading,
    isFetching: isDayFetching,
  } = useGetPilgrimageDayQuery(
    {
      year: PILGRIMAGE_YEAR,
      dayNumber: currentDayFetchNumber ?? 1,
    },
    {
      skip: currentDayFetchNumber === null,
    }
  );
  const routeLocation = pilgrimageDay
    ? getCurrentRouteLocation(pilgrimageDay, currentLocation, new Date(), locationSource)
    : null;
  const fallbackLocation = routeLocation?.location;
  const latitude =
    routeLocation?.source === 'gps' && currentLocation
      ? currentLocation.latitude
      : fallbackLocation?.latitude;
  const longitude =
    routeLocation?.source === 'gps' && currentLocation
      ? currentLocation.longitude
      : fallbackLocation?.longitude;
  const source: WeatherSource = routeLocation?.source ?? 'fallback';

  const [weather, setWeather] = useState<PilgrimageWeather>(pilgrimageDay?.weather ?? DEFAULT_WEATHER);
  const [hourlyForecast, setHourlyForecast] = useState<PilgrimageHourlyWeatherItem[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(currentDayFetchNumber !== null));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadWeather = async () => {
      if (isPilgrimageLoading || isPilgrimageFetching || isDayLoading || isDayFetching) {
        setIsLoading(true);
        setError(null);
        return;
      }

      if (!pilgrimageDay || typeof latitude !== 'number' || typeof longitude !== 'number') {
        setWeather(pilgrimageDay?.weather ?? DEFAULT_WEATHER);
        setHourlyForecast([]);
        setIsLoading(false);
        setError(
          pilgrimageDay ? 'Brak wspolrzednych aktualnego etapu.' : 'Nie udalo sie pobrac aktualnego etapu z API.'
        );
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          current: 'temperature_2m,weather_code,is_day',
          hourly: 'temperature_2m,weather_code,is_day',
          timezone: 'auto',
          forecast_days: '1',
        });
        const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Open-Meteo responded with ${response.status}`);
        }

        const data = (await response.json()) as OpenMeteoWeatherResponse;

        if (
          typeof data.current?.temperature_2m !== 'number' ||
          Number.isNaN(data.current.temperature_2m)
        ) {
          throw new Error('Brak aktualnej temperatury w odpowiedzi Open-Meteo.');
        }

        if (!isMounted) {
          return;
        }

        setWeather(
          mapWeatherCodeToWeather(
            data.current.weather_code,
            Math.round(data.current.temperature_2m),
            data.current.is_day !== 0
          )
        );
        setHourlyForecast(buildHourlyForecast(data.hourly));
      } catch (nextError) {
        if (controller.signal.aborted || !isMounted) {
          return;
        }

        setWeather(pilgrimageDay.weather);
        setHourlyForecast([]);
        setError(
          nextError instanceof Error ? nextError.message : 'Nie udało się pobrać pogody z Open-Meteo.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadWeather();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    isDayFetching,
    isDayLoading,
    isPilgrimageFetching,
    isPilgrimageLoading,
    latitude,
    longitude,
    pilgrimageDay,
  ]);

  return {
    weather,
    hourlyForecast,
    isLoading,
    error,
    source: error ? 'fallback' : source,
  };
}
