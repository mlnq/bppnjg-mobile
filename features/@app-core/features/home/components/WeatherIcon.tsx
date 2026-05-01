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
};

export function WeatherIcon({ icon }: WeatherIconProps) {
  const iconName = getWeatherIconName(icon);

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

  return <SunnyIcon />;
}
