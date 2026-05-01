import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  HomeIcon,
  PrayerIcon,
  RouteIcon,
  pilgrimageRouteTheme,
} from '../../../packages/@app-ui';
import { type AppTab } from '../routes/appTabs';

const { colors, typography } = pilgrimageRouteTheme;

type NavItem = {
  id: AppTab;
  label: string;
};

const items: readonly NavItem[] = [
  { id: 'home', label: 'Start' },
  { id: 'route', label: 'Trasa' },
  { id: 'prayer', label: 'Niezbędnik' },
];

type PilgrimageBottomNavProps = {
  activeTab?: AppTab;
  onTabChange: (tab: AppTab) => void;
};

function renderNavIcon(itemId: AppTab, activeTab?: AppTab) {
  if (itemId === 'home') {
    return <HomeIcon active={itemId === activeTab} />;
  }

  if (itemId === 'route') {
    return <RouteIcon active={itemId === activeTab} />;
  }

  return <PrayerIcon active={itemId === activeTab} />;
}

export function PilgrimageBottomNav({ activeTab, onTabChange }: PilgrimageBottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around rounded-t-[22px] border-t px-[10px] pt-2"
      style={{
        minHeight: 82 + insets.bottom,
        paddingBottom: Math.max(insets.bottom, 12),
        backgroundColor: colors.surfaceContainerLowest,
        borderTopColor: '#efeaf1',
      }}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          activeOpacity={0.75}
          onPress={() => onTabChange(item.id)}
          className="h-14 min-w-[54px] items-center justify-center gap-1 rounded-[14px]">
          {renderNavIcon(item.id, activeTab)}
          <Text
            className="text-[10px] font-bold"
            style={{
              color: item.id === activeTab ? colors.primaryContainer : '#9ca0a7',
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
