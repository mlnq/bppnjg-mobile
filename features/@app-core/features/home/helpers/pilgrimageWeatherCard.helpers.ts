import type { PilgrimageWeatherIcon } from '../../../constants/pilgrimageRoute';

export type WeatherIconName =
  | 'cloudy'
  | 'rain'
  | 'storm'
  | 'partlyCloudy'
  | 'partlyCloudyNight'
  | 'sunny'
  | 'clearNight';

export function getWeatherIconName(icon: PilgrimageWeatherIcon, isDay = true): WeatherIconName {
  if (icon === 'cloudy') {
    return 'cloudy';
  }

  if (icon === 'rain') {
    return 'rain';
  }

  if (icon === 'storm') {
    return 'storm';
  }

  if (icon === 'partlyCloudy') {
    return isDay ? 'partlyCloudy' : 'partlyCloudyNight';
  }

  return isDay ? 'sunny' : 'clearNight';
}
