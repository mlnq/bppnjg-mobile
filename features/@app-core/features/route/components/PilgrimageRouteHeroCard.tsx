import { Text, TouchableOpacity, View } from 'react-native';
import MapPinned from 'lucide-react-native/dist/esm/icons/map-pinned.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { PilgrimageDay, Town } from '../../../constants/pilgrimageRoute';
import { getTownById } from '../../../constants/pilgrimageRoute';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { getRemainingDistanceFromCurrentLocation } from '../../../utils/pilgrimageCurrentLocation';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageRouteHeroCardProps = {
  day: PilgrimageDay;
  towns: readonly Town[];
  totalDays: number;
  accentSource: 'time-estimated' | 'gps';
  positionLabel: string;
  onOpenInfo: () => void;
};

function formatDistance(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function PilgrimageRouteHeroCard({
  day,
  towns,
  totalDays,
  accentSource,
  positionLabel,
  onOpenInfo,
}: PilgrimageRouteHeroCardProps) {
  const { currentLocation } = useUserLocation();
  const remainingDistanceKm = getRemainingDistanceFromCurrentLocation({
    day,
    towns,
    currentLocation,
  });
  const walkedDistanceKm = Math.max(0, day.route.totalDistanceKm - remainingDistanceKm);
  const startTown = getTownById(day.route.startTownId, towns);
  const endTown = getTownById(day.route.endTownId, towns);
  const accentColor = accentSource === 'time-estimated' ? colors.secondary : colors.primary;
  const trackColor = accentSource === 'time-estimated' ? '#F8EDCF' : '#F6DFEA';

  return (
    <View
      className="mt-6 rounded-[34px] border px-6 py-8"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#ececf0',
        shadowColor: '#1c2433',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      <View className="flex-row items-start justify-between gap-3">
        <Text
          className="flex-1 text-center text-[12px] font-bold uppercase tracking-[1px]"
          style={{ color: accentColor, fontFamily: typography.fontFamily }}>
          DZIEŃ {day.dayNumber} Z {totalDays} {(day.title || '').toUpperCase()}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenInfo}
          className="rounded-full px-3 py-2"
          style={{ backgroundColor: accentSource === 'time-estimated' ? '#FFF4D6' : '#F9EDF4' }}>
          <View className="flex-row items-center">
            <MapPinned size={14} color={accentColor} strokeWidth={2.1} />
            <Text
              className="ml-2 text-[11px] font-bold uppercase tracking-[0.6px]"
              style={{ color: accentColor, fontFamily: typography.fontFamily }}>
              {positionLabel}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text
        className="mt-4 text-center text-[30px] font-bold leading-[38px]"
        style={{ color: '#172033', fontFamily: typography.fontFamily }}>
        {startTown?.name ?? 'Brak startu'} → {endTown?.name ?? 'Brak celu dnia'}
      </Text>

      <View className="items-center">
        <View
          className="mt-8 h-[190px] w-[190px] items-center justify-center rounded-full"
          style={{
            borderWidth: 12,
            borderColor: trackColor,
          }}>
          <Text
            className="text-[46px] font-bold"
            style={{ color: accentColor, fontFamily: typography.fontFamily }}>
            {formatDistance(remainingDistanceKm)}
          </Text>
          <Text
            className="mt-1 text-[14px] font-bold uppercase tracking-[0.8px]"
            style={{ color: accentColor, fontFamily: typography.fontFamily }}>
            KM DO CELU
          </Text>
        </View>
      </View>

      <Text
        className="mt-10 text-center text-[16px] leading-7"
        style={{ color: '#56637A', fontFamily: typography.fontFamily }}>
        Przeszłeś już {formatDistance(walkedDistanceKm)} km z {formatDistance(day.route.totalDistanceKm)} km
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onOpenInfo}
        className="mt-5 self-center rounded-full px-4 py-2"
        style={{ backgroundColor: accentSource === 'time-estimated' ? '#FFF4D6' : '#F9EDF4' }}>
        <View className="flex-row items-center">
          <MapPinned size={16} color={accentColor} strokeWidth={2.1} />
          <Text
            className="ml-2 text-[13px] font-semibold"
            style={{ color: accentColor, fontFamily: typography.fontFamily }}>
            Jak wyznaczamy pozycję na trasie?
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
