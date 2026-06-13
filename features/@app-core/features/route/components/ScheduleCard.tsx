import { Text, View } from 'react-native';
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import type { PilgrimageDayScheduleItem as PilgrimageDayScheduleItemModel } from '../../../constants/pilgrimageRoute';
import {PilgrimageRoutePositionBadge} from "./PilgrimageRoutePositionBadge";
import {PilgrimageScheduleSegmentBadge} from "./PilgrimageScheduleSegmentBadge";
import {formatDurationMinutes} from "../../../utils/formatters/formatDurationMinutes";
import {Timer} from "lucide-react-native";
import {PilgrimageTimeBadge} from "./PilgrimageTimeBadge";


const { colors, typography } = pilgrimageRouteTheme;
const CARD_BORDER = colors.outlineVariant;
const CARD_BACKGROUND = colors.surfaceContainerLowest;
const ACTIVE_CARD_BACKGROUND = colors.primary;
const ACTIVE_CARD_BORDER = colors.primary;

type PilgrimageScheduleCardProps = {
  item: PilgrimageDayScheduleItemModel;
  townName: string;
  isCurrentStop: boolean;
  isEdgeStop: boolean;
  accentColor: string;
  isScheduleEstimated: boolean;
  accentBadgeTextColor: string;
};

export function PilgrimageScheduleCard({
  item,
  townName,
  isCurrentStop,
  isEdgeStop,
  accentColor,
  isScheduleEstimated,
  accentBadgeTextColor,
}: PilgrimageScheduleCardProps) {
  const cardStyle = {
    borderRadius: 28,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  };

  return (
    <View
      className="relative min-h-[108px] overflow-hidden rounded-[28px] border px-5 pb-5 pt-5"
      style={[
        {
          backgroundColor: isCurrentStop ? ACTIVE_CARD_BACKGROUND : CARD_BACKGROUND,
          borderColor: isCurrentStop ? ACTIVE_CARD_BORDER : CARD_BORDER,
          borderWidth: 1,
          elevation: 2,
        },
        cardStyle,
      ]}>
      <View className="flex-row items-center justify-between gap-3">
        <Text
          className="text-[20px] font-bold"
          style={{
            color: isCurrentStop ? colors.onPrimary : accentColor,
            fontFamily: typography.fontFamily,
          }}>
          {item.time}
        </Text>
          <PilgrimageTimeBadge
              durationMin={item.durationMin}
              isCurrentStop={isCurrentStop}
          />
      </View>
      <Text
        className="mt-3 text-[19px] font-bold leading-[26px]"
        style={{
          color: isCurrentStop ? colors.onPrimary : colors.onSurface,
          fontFamily: typography.fontFamily,
        }}>
        {townName}
      </Text>
      {item.title ? (
        <Text
          className="mt-1 text-[14px] leading-[21px]"
          style={{
            color: isCurrentStop ? colors.onPrimary : colors.onSurfaceVariant,
            fontFamily: typography.fontFamily,
          }}>
          {item.title}
        </Text>
      ) : null}
      {item.description ? (
        <Text
          className="mt-1 text-[13px] leading-[20px]"
          style={{
            color: isCurrentStop ? colors.onPrimary : colors.onSurfaceVariant,
            fontFamily: typography.fontFamily,
          }}>
          {item.description}
        </Text>
      ) : null}

      {isCurrentStop ? (
        <Text
          className="mt-3 text-[11px] font-bold uppercase tracking-[0.9px]"
          style={{ color: colors.onPrimary, fontFamily: typography.fontFamily }}>
          Aktualny punkt
        </Text>
      ) : null}
    </View>
  );
}
