import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Bell from 'lucide-react-native/dist/esm/icons/bell.mjs';
import Heart from 'lucide-react-native/dist/esm/icons/heart.mjs';
import House from 'lucide-react-native/dist/esm/icons/house.mjs';
import MessageSquare from 'lucide-react-native/dist/esm/icons/message-square.mjs';
import SlidersHorizontal from 'lucide-react-native/dist/esm/icons/sliders-horizontal.mjs';
import Smartphone from 'lucide-react-native/dist/esm/icons/smartphone.mjs';
import { View } from 'react-native';

import { pilgrimageRouteTheme } from '../../theme/pilgrimageRouteTheme';

const { colors } = pilgrimageRouteTheme;

type IconProps = {
  size?: number;
  color?: string;
};

type NavIconProps = IconProps & {
  active?: boolean;
};

export function MenuIcon({ size = 24, color = colors.primary }: IconProps) {
  return <Feather name="menu" size={size} color={color} />;
}

export function LogoIcon({ size = 24, color = colors.primary }: IconProps) {
  return <MaterialCommunityIcons name="church" size={size} color={color} />;
}

export function FilterIcon({ size = 18, color = colors.primary }: IconProps) {
  return <MaterialIcons name="filter-list" size={size} color={color} />;
}

export function WalkIcon({ size = 18, color = colors.primary }: IconProps) {
  return <MaterialIcons name="directions-walk" size={size} color={color} />;
}

export function TimerIcon({ size = 18, color = colors.primary }: IconProps) {
  return <MaterialIcons name="timer" size={size} color={color} />;
}

export function MealIcon({ size = 18, color = colors.primary }: IconProps) {
  return <MaterialIcons name="restaurant" size={size} color={color} />;
}

export function InfoIcon({ size = 16, color = colors.primary }: IconProps) {
  return <MaterialIcons name="info" size={size} color={color} />;
}

export function MedicalIcon({ size = 18, color = colors.primary }: IconProps) {
  return <MaterialIcons name="local-hospital" size={size} color={color} />;
}

export function ChurchIcon({ size = 18, color = colors.primary }: IconProps) {
  return <MaterialCommunityIcons name="church" size={size} color={color} />;
}

export function BedtimeIcon({ size = 20, color = colors.primary }: IconProps) {
  return <MaterialIcons name="bedtime" size={size} color={color} />;
}

export function PrayerHandsIcon({ size = 18, color = colors.primary }: IconProps) {
  return <MaterialCommunityIcons name="hands-pray" size={size} color={color} />;
}

export function ExpandIcon({ size = 22, color = '#ffffff' }: IconProps) {
  return <MaterialIcons name="open-in-full" size={size} color={color} />;
}

export function WordIcon({ size = 18, color = colors.primary }: IconProps) {
  return <MaterialIcons name="auto-stories" size={size} color={color} />;
}

export function HymnalIcon({ size = 22, color = colors.primary }: IconProps) {
  return <MaterialCommunityIcons name="music-clef-treble" size={size} color={color} />;
}

export function ReadingsIcon({ size = 22, color = colors.primary }: IconProps) {
  return <MaterialCommunityIcons name="book-open-page-variant" size={size} color={color} />;
}

export function PrayerBookIcon({ size = 22, color = colors.primary }: IconProps) {
  return <MaterialCommunityIcons name="book-heart-outline" size={size} color={color} />;
}

export function BreviaryIcon({ size = 22, color = colors.primary }: IconProps) {
  return <MaterialIcons name="menu-book" size={size} color={color} />;
}

export function SunnyIcon({ size = 40, color = '#f5b400' }: IconProps) {
  return <MaterialCommunityIcons name="weather-sunny" size={size} color={color} />;
}

export function CloudyIcon({ size = 40, color = '#7d8ea3' }: IconProps) {
  return <MaterialCommunityIcons name="weather-cloudy" size={size} color={color} />;
}

export function RainIcon({ size = 40, color = '#4d86b7' }: IconProps) {
  return <MaterialCommunityIcons name="weather-rainy" size={size} color={color} />;
}

export function StormIcon({ size = 40, color = '#51607d' }: IconProps) {
  return <MaterialCommunityIcons name="weather-lightning-rainy" size={size} color={color} />;
}

export function PartlyCloudyIcon({ size = 40, color = '#d89a00' }: IconProps) {
  return <MaterialCommunityIcons name="weather-partly-cloudy" size={size} color={color} />;
}

export function NewsIcon({ size = 22, color = '#93979f', active = false }: NavIconProps) {
  return (
    <MaterialIcons name="campaign" size={size} color={active ? colors.primaryContainer : color} />
  );
}

export function BellIcon({ size = 22, color = colors.primary }: IconProps) {
  return <Bell size={size} color={color} strokeWidth={2.1} />;
}

export function HomeIcon({ size = 22, color = '#93979f', active = false }: NavIconProps) {
  return (
    <House size={size} color={active ? colors.primaryContainer : color} strokeWidth={2.1} />
  );
}

export function RouteIcon({ size = 22, color = '#93979f', active = false }: NavIconProps) {
  return (
    <SlidersHorizontal
      size={size}
      color={active ? colors.primaryContainer : color}
      strokeWidth={2.1}
    />
  );
}

export function MapIcon({ size = 22, color = '#93979f', active = false }: NavIconProps) {
  return (
    <MaterialCommunityIcons
      name="map"
      size={size}
      color={active ? colors.primaryContainer : color}
    />
  );
}

export function PrayerIcon({ size = 22, color = '#93979f', active = false }: NavIconProps) {
  const iconColor = active ? colors.primaryContainer : color;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Smartphone size={size} color={iconColor} strokeWidth={2.1} />
      <View style={{ position: 'absolute', top: size * 0.14 }}>
        <Heart size={size * 0.33} color={iconColor} strokeWidth={2.3} />
      </View>
    </View>
  );
}

export function InfoNavIcon({ size = 22, color = '#93979f', active = false }: NavIconProps) {
  return (
    <MessageSquare
      size={size}
      color={active ? colors.primaryContainer : color}
      strokeWidth={2.1}
    />
  );
}

export function AvatarIcon() {
  return (
    <View
      className="h-9 w-9 items-center justify-center rounded-[18px] border-2"
      style={{ backgroundColor: '#2c1b1a', borderColor: '#d4b093' }}>
      <Ionicons name="person" size={16} color="#f3d6be" />
    </View>
  );
}
