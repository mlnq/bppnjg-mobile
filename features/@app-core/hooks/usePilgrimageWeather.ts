import { useEffect, useState } from 'react';

import { pilgrimageDay, type PilgrimageWeather } from '../constants/pilgrimageRoute';
import { useUserLocation } from './useUserLocation';
import { getCurrentRouteLocation } from '../utils/pilgrimageCurrentLocation';

type OpenMeteoWeatherResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    weather_code?: number[];
  };
};

type WeatherSource = 'gps' | 'time-estimated' | 'fallback';

export type PilgrimageHourlyWeatherItem = {
  time: string;
  temperatureC: number;
  summary: string;
  icon: PilgrimageWeather['icon'];
};

type UsePilgrimageWeatherResult = {
  weather: PilgrimageWeather;
  hourlyForecast: PilgrimageHourlyWeatherItem[];
  isLoading: boolean;
  error: string | null;
  source: WeatherSource;
};

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

function mapWeatherCodeToWeather(code: number | undefined, temperatureC: number): PilgrimageWeather {
  if (code === 0) {
    return { temperatureC, summary: 'Słonecznie', icon: 'sunny' };
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

      const mappedWeather = mapWeatherCodeToWeather(hourly.weather_code?.[index], Math.round(temperature));

      return {
        time,
        temperatureC: mappedWeather.temperatureC,
        summary: mappedWeather.summary,
        icon: mappedWeather.icon,
      };
    })
    .filter((item): item is PilgrimageHourlyWeatherItem => item !== null)
    .slice(0, 12);
}

export function usePilgrimageWeather(): UsePilgrimageWeatherResult {
  const { currentLocation } = useUserLocation();
  const fallbackLocation = getCurrentRouteLocation(pilgrimageDay, currentLocation).location;
  const latitude = currentLocation?.latitude ?? fallbackLocation.latitude;
  const longitude = currentLocation?.longitude ?? fallbackLocation.longitude;
  const source: WeatherSource = currentLocation ? 'gps' : 'time-estimated';

  const [weather, setWeather] = useState<PilgrimageWeather>(pilgrimageDay.weather);
  const [hourlyForecast, setHourlyForecast] = useState<PilgrimageHourlyWeatherItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          current: 'temperature_2m,weather_code',
          hourly: 'temperature_2m,weather_code',
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
            Math.round(data.current.temperature_2m)
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
  }, [latitude, longitude]);

  return {
    weather,
    hourlyForecast,
    isLoading,
    error,
    source: error ? 'fallback' : source,
  };
}
