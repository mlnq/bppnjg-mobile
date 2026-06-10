import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  CloudyIcon,
  PartlyCloudyIcon,
  RainIcon,
  StormIcon,
  SunnyIcon,
} from '../../../../../packages/@app-ui';
import type { PilgrimageWeatherIcon } from '../../../constants/pilgrimageRoute';
import { getWeatherIconName } from '../helpers/pilgrimageWeatherCard.helpers';

type WeatherIconProps = {
  icon: PilgrimageWeatherIcon;
  isDay?: boolean;
};

export function WeatherIcon({ icon, isDay = true }: WeatherIconProps) {
  const iconName = getWeatherIconName(icon, isDay);

  if (iconName === 'cloudy') {
    return <CloudyIcon />;
  }

  if (iconName === 'rain') {
    return <RainIcon />;
  }

  if (iconName === 'storm') {
    return <StormIcon />;
  }

  if (iconName === 'partlyCloudy') {
    return <PartlyCloudyIcon />;
  }

  if (iconName === 'partlyCloudyNight') {
    return <MaterialCommunityIcons name="weather-night-partly-cloudy" size={40} color="#7d8ea3" />;
  }

  if (iconName === 'clearNight') {
    return <MaterialCommunityIcons name="weather-night" size={40} color="#7d8ea3" />;
  }

  return <SunnyIcon />;
}
