import { Text, TouchableOpacity, View } from 'react-native';
import Megaphone from 'lucide-react-native/dist/esm/icons/megaphone.mjs';
import FlaskConical from 'lucide-react-native/dist/esm/icons/flask-conical.mjs';
import Heart from 'lucide-react-native/dist/esm/icons/heart.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { type PilgrimageNewsItem } from '../../../constants/pilgrimageRoute';
import { formatPilgrimageNewsPublishedAt } from '../helpers/pilgrimageNewsCard.helpers';

const { colors, typography } = pilgrimageRouteTheme;

function getCardStyles(item: PilgrimageNewsItem) {
  if (item.pushType === 'test') {
    return {
      cardBackgroundColor: '#F7F1FF',
      cardBorderColor: '#E3CCFF',
      iconBackgroundColor: '#DEC2FF',
      iconColor: '#8B1CF3',
      summaryColor: '#526076',
      badgeBackgroundColor: '#EDDFFF',
      badgeColor: '#8B1CF3',
      opacity: 1,
    };
  }

  if (item.pushType === 'medical') {
    return {
      cardBackgroundColor: '#FFF3F3',
      cardBorderColor: '#FFBDBD',
      iconBackgroundColor: '#FFCACA',
      iconColor: '#DD1111',
      summaryColor: '#526076',
      badgeBackgroundColor: '#FFE0E0',
      badgeColor: '#DD1111',
      opacity: 1,
    };
  }

  return {
    cardBackgroundColor: '#FFFFFF',
    cardBorderColor: '#E8EDF3',
    iconBackgroundColor: '#FFF0B8',
    iconColor: '#C96B00',
    summaryColor: '#526076',
    badgeBackgroundColor: 'transparent',
    badgeColor: 'transparent',
    opacity: 1,
  };
}

function getBadge(item: PilgrimageNewsItem) {
  if (item.pushType === 'test') {
    return {
      label: 'TEST',
      backgroundColor: '#EDDFFF',
      color: '#8B1CF3',
    };
  }

  if (item.pushType === 'medical') {
    return {
      label: 'PILNE',
      backgroundColor: '#FFE0E0',
      color: '#DD1111',
    };
  }

  return undefined;
}

function renderCardIcon(item: PilgrimageNewsItem, color: string) {
  if (item.pushType === 'medical') {
    return <Heart size={24} color={color} strokeWidth={2.1} />;
  }

  if (item.pushType === 'test') {
    return <FlaskConical size={24} color={color} strokeWidth={2.1} />;
  }

  return <Megaphone size={24} color={color} strokeWidth={2.1} />;
}

type PilgrimageNewsCardProps = {
  item: PilgrimageNewsItem;
  compact?: boolean;
  onPress?: (item: PilgrimageNewsItem) => void;
};

export function PilgrimageNewsCard({ item, compact = false, onPress }: PilgrimageNewsCardProps) {
  const cardStyles = getCardStyles(item);
  const badge = getBadge(item);

  return (
    <TouchableOpacity
      disabled={!onPress}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress ? () => onPress(item) : undefined}
      className={`flex-row rounded-[28px] ${compact ? 'px-4 py-4' : 'px-5 py-5'}`}
      style={{
        backgroundColor: cardStyles.cardBackgroundColor,
        borderWidth: 1,
        borderColor: cardStyles.cardBorderColor,
        opacity: cardStyles.opacity,
        shadowColor: '#10213A',
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      <View
        className={`items-center justify-center rounded-full ${
          compact ? 'mr-3 h-14 w-14' : 'mr-4 h-[72px] w-[72px]'
        }`}
        style={{ backgroundColor: cardStyles.iconBackgroundColor }}>
        {renderCardIcon(item, cardStyles.iconColor)}
      </View>

      <View className="flex-1 justify-center pr-2">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text
              className={`font-bold ${compact ? 'text-[16px] leading-6' : 'text-[18px] leading-7'}`}
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {item.title}
            </Text>
            <Text
              className={`mt-1 ${compact ? 'text-[15px] leading-6' : 'text-[16px] leading-7'}`}
              style={{ color: cardStyles.summaryColor, fontFamily: typography.fontFamily }}>
              {item.summary}
            </Text>
          </View>
          {badge ? (
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: badge.backgroundColor }}>
              <Text
                className="text-[10px] font-bold uppercase tracking-[0.8px]"
                style={{ color: badge.color, fontFamily: typography.fontFamily }}>
                {badge.label}
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          className="mt-4 text-[11px] font-medium tracking-[0.2px]"
          style={{ color: '#67748B', fontFamily: typography.fontFamily }}>
          {formatPilgrimageNewsPublishedAt(item.publishedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
