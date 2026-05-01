import type { PilgrimageWeatherIcon } from '../../../constants/pilgrimageRoute';

export type WeatherIconName = 'cloudy' | 'rain' | 'storm' | 'partlyCloudy' | 'sunny';

export function getWeatherIconName(icon: PilgrimageWeatherIcon): WeatherIconName {
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
    return 'partlyCloudy';
  }

  return 'sunny';
}
