import { Text, View } from 'react-native';
import Footprints from 'lucide-react-native/dist/esm/icons/footprints.mjs';
import MapPinned from 'lucide-react-native/dist/esm/icons/map-pinned.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { PilgrimageDayScheduleItem as PilgrimageDayScheduleItemModel } from '../../../constants/pilgrimageRoute';
import { formatDistanceKm } from '../../../utils/formatDistanceKm';

const { colors, radii, typography } = pilgrimageRouteTheme;

type PilgrimageScheduleCardProps = {
  item: PilgrimageDayScheduleItemModel;
  townName: string;
  isCurrentStop: boolean;
  isEdgeStop: boolean;
  accentColor: string;
  accentBadgeTextColor: string;
  currentStopBadgeLabel: string;
};

export function PilgrimageScheduleCard({
  item,
  townName,
  isCurrentStop,
  isEdgeStop,
  accentColor,
  accentBadgeTextColor,
  currentStopBadgeLabel,
}: PilgrimageScheduleCardProps) {
  const badgeBackgroundColor = isCurrentStop ? '#ffffff' : '#F7E8EF';
  const badgeTextColor = isCurrentStop ? '#56637A' : '#842160';
  const cardStyle = isCurrentStop
    ? {
        backgroundColor: accentColor,
        borderColor: accentColor,
        borderRadius: 28,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      }
    : {
        backgroundColor: colors.surfaceContainerLowest,
        borderColor: '#ececf0',
        borderRadius: 28,
        shadowColor: '#1c2433',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      };

  return (
    <View
      className="relative min-h-[160px] overflow-hidden border px-5 pb-5 pt-5"
      style={cardStyle}>
      <View className="flex-row items-start justify-between gap-3">
      <Text
        className="text-[20px] font-bold"
        style={{
          color: isCurrentStop ? accentBadgeTextColor : accentColor,
          fontFamily: typography.fontFamily,
        }}>
        {item.time}
        </Text>
        {item.distanceToNextKm > 0 ? (
          <View
            className="flex-row items-center rounded-full px-3 py-[6px]"
            style={{
              backgroundColor: badgeBackgroundColor,
            }}>
            <Footprints size={14} color={badgeTextColor} strokeWidth={2.1} />
            <Text
              className="ml-2 text-[12px] font-bold"
              style={{
                color: badgeTextColor,
                fontFamily: typography.fontFamily,
              }}>
              {formatDistanceKm(item.distanceToNextKm)}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        className="mt-2 text-[17px] font-bold leading-[24px]"
        style={{
          color: isCurrentStop ? accentBadgeTextColor : colors.onSurface,
          fontFamily: typography.fontFamily,
        }}>
        {townName}
      </Text>
      {item.title ? (
        <Text
          className="mt-2 text-[14px] leading-[21px]"
          style={{
            color: isCurrentStop ? 'rgba(255,255,255,0.92)' : colors.onSurfaceVariant,
            fontFamily: typography.fontFamily,
          }}>
          {item.title}
        </Text>
      ) : null}
      {item.description ? (
        <Text
          className="mt-1 text-[13px] leading-[20px]"
          style={{
            color: isCurrentStop ? 'rgba(255,255,255,0.92)' : colors.onSurfaceVariant,
            fontFamily: typography.fontFamily,
          }}>
          {item.description}
        </Text>
      ) : null}
      {isCurrentStop ? (
        <View className="mt-4 flex-row items-center">
          <Text
            className="text-[14px] font-bold"
            style={{ color: accentBadgeTextColor, fontFamily: typography.fontFamily }}>
            {currentStopBadgeLabel}
          </Text>
          <MapPinned size={18} color={accentBadgeTextColor} strokeWidth={2.1} />
        </View>
      ) : null}
    </View>
  );
}
