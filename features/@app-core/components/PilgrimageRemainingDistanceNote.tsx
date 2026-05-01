import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';

const { colors, radii, typography } = pilgrimageRouteTheme;

type PilgrimageRemainingDistanceNoteProps = {
  remainingDistanceKm: number;
  fallbackReason?: 'outside-route' | 'location-unavailable';
  source: 'time-estimated' | 'gps';
};

export function PilgrimageRemainingDistanceNote({
  remainingDistanceKm,
  fallbackReason,
  source,
}: PilgrimageRemainingDistanceNoteProps) {
  if (source === 'gps') {
    return null;
  }

  const formattedDistanceKm = remainingDistanceKm.toFixed(1);
  const message =
    fallbackReason === 'outside-route'
      ? `Jesteś teraz poza trasą, dlatego kilometry pokazujemy zgodnie z planem dnia. Do celu zostało około ${formattedDistanceKm} km.`
      : `Telefon nie pokazuje teraz pozycji na trasie, dlatego kilometry liczymy zgodnie z planem dnia. Do celu zostało około ${formattedDistanceKm} km.`;

  return (
    <View
      className="mt-3 rounded-xl px-3 py-3"
      style={{
        backgroundColor: '#fff6df',
        borderColor: '#f1d98b',
        borderRadius: radii.md,
        borderWidth: 1,
      }}>
      <Text
        className="text-[13px] leading-5"
        style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
        {message}
      </Text>
    </View>
  );
}
