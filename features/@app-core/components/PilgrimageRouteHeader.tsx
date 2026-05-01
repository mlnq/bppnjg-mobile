import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BellIcon, pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { useNotificationsBadge } from '../hooks/useNotificationsBadge';
import { type AppTab } from '../routes/appTabs';
import { notificationsApi, useGetPilgrimageNotificationsQuery } from '../services/notificationsApi';
import { store } from '../store/store';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageRouteHeaderProps = {
  activeTab: AppTab;
  onOpenNews: () => void;
};

const SECTION_TITLES: Record<AppTab, string> = {
  home: 'Start',
  route: 'Trasa',
  prayer: 'Niezbędnik',
};

export function PilgrimageRouteHeader({ activeTab, onOpenNews }: PilgrimageRouteHeaderProps) {
  const router = useRouter();
  const { data: notifications } = useGetPilgrimageNotificationsQuery();
  const { hasUnreadNotifications } = useNotificationsBadge(notifications);

  const handleOpenNews = () => {
    store.dispatch(
      notificationsApi.util.prefetch('getPilgrimageNotifications', undefined, {
        force: false,
      })
    );
    onOpenNews();
  };

  return (
    <View
      className="relative flex-row items-center justify-center border-b px-5"
      style={[
        {
          height: 72,
          backgroundColor: colors.surfaceContainerLowest,
          borderBottomColor: colors.surfaceContainer,
        },
      ]}>
      <View className="flex-row items-center gap-2">
        <Text
          className="text-[24px] font-bold"
          style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
          {SECTION_TITLES[activeTab]}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={() => {
          store.dispatch(
            notificationsApi.util.prefetch('getPilgrimageNotifications', undefined, {
              force: false,
            })
          );
        }}
        onPress={handleOpenNews}
        className="absolute right-5 h-11 w-11 items-center justify-center rounded-full">
        <BellIcon size={22} color={colors.onSurface} />
        {hasUnreadNotifications ? (
          <View
            className="absolute right-[7px] top-[7px] h-3 w-3 rounded-full"
            style={{
              backgroundColor: '#d12f2f',
              borderWidth: 2,
              borderColor: colors.surfaceContainerLowest,
            }}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
}
