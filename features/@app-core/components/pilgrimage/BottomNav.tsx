import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  HomeIcon,
  InfoNavIcon,
  PrayerIcon,
  RouteIcon,
  pilgrimageRouteTheme,
} from '../../../packages/@app-ui';
import { type AppTab } from '../routes/appTabs';
import { useNotificationsBadge } from '../hooks/useNotificationsBadge';
import { useGetPilgrimageNotificationsQuery } from '../services/notificationsApi';

const { colors, typography } = pilgrimageRouteTheme;
const INACTIVE_TAB_COLOR = colors.onSurfaceVariant;
export const BOTTOM_NAV_HEIGHT = 82;

type NavItem = {
  id: AppTab;
  label: string;
};

const items: readonly NavItem[] = [
  { id: 'home', label: 'Start' },
  { id: 'route', label: 'Trasa' },
  { id: 'prayer', label: 'Niezbędnik' },
  { id: 'info', label: 'Info' },
];

type PilgrimageBottomNavProps = {
  activeTab?: AppTab;
  onTabChange: (tab: AppTab) => void;
};

function renderNavIcon(itemId: AppTab, activeTab?: AppTab) {
  const iconColor = itemId === activeTab ? colors.primary : INACTIVE_TAB_COLOR;

  if (itemId === 'home') {
    return <HomeIcon size={24} color={iconColor} />;
  }

  if (itemId === 'route') {
    return <RouteIcon color={iconColor} />;
  }

  if (itemId === 'info') {
    return <InfoNavIcon size={24} color={iconColor} active={itemId === activeTab} />;
  }

  return <PrayerIcon size={24} color={iconColor} />;
}

export function PilgrimageBottomNav({ activeTab, onTabChange }: PilgrimageBottomNavProps) {
  const insets = useSafeAreaInsets();
  const { data: notifications } = useGetPilgrimageNotificationsQuery();
  const { hasUnreadNotifications } = useNotificationsBadge(notifications);

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around rounded-t-[22px] border-t px-[10px] pt-2"
      style={{
        minHeight: BOTTOM_NAV_HEIGHT + insets.bottom,
        paddingBottom: Math.max(insets.bottom, 12),
        backgroundColor: colors.surfaceContainerLowest,
        borderTopColor: colors.outlineVariant,
      }}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          activeOpacity={0.75}
          onPress={() => onTabChange(item.id)}
          className="h-14 min-w-[54px] items-center justify-center gap-1 rounded-[14px]">
          <View className="relative">
            {renderNavIcon(item.id, activeTab)}
            {item.id === 'info' && hasUnreadNotifications ? (
              <View
                className="absolute -right-1 top-0 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: '#d12f2f',
                }}
              />
            ) : null}
          </View>
          <Text
            className="text-[10px] font-bold"
            style={{
              color: item.id === activeTab ? colors.primary : INACTIVE_TAB_COLOR,
              fontFamily: typography.fontFamily,
              letterSpacing: 0.8,
            }}>
            {item.label.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
