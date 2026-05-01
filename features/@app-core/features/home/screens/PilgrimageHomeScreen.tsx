import { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { PilgrimageConferenceCard } from '../../../components/PilgrimageConferenceCard';
import { PilgrimageLatestNewsSection } from '../../../components/PilgrimageLatestNewsSection';
import { PilgrimageQuartermasterSection } from '../../../components/PilgrimageQuartermasterSection';
import { useGetPilgrimageNotificationsQuery } from '../../../services/notificationsApi';
import { useGetPilgrimageBootstrapQuery } from '../../../services/pilgrimageApi';
import { useGetQuartermasterCommentsQuery } from '../../../services/quartermasterApi';
import { PilgrimageRoutePreview } from '../components/PilgrimageRoutePreview';
import { PilgrimageWeatherCard } from '../components/PilgrimageWeatherCard';

const { colors } = pilgrimageRouteTheme;

type PilgrimageHomeScreenProps = {
  onShowNews?: () => void;
  onShowConference?: () => void;
  onShowQuartermaster?: () => void;
};

export function PilgrimageHomeScreen({
  onShowNews,
  onShowConference,
  onShowQuartermaster,
}: PilgrimageHomeScreenProps) {
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const { isLoading: isBootstrapLoading, isFetching: isBootstrapFetching, refetch: refetchBootstrap } =
    useGetPilgrimageBootstrapQuery();
  const {
    isLoading: isNotificationsLoading,
    isFetching: isNotificationsFetching,
    refetch: refetchNotifications,
  } = useGetPilgrimageNotificationsQuery();
  const {
    isLoading: isQuartermasterLoading,
    isFetching: isQuartermasterFetching,
    refetch: refetchQuartermaster,
  } = useGetQuartermasterCommentsQuery();
  const handleRefresh = async () => {
    setIsManualRefreshing(true);

    try {
      await Promise.all([
        refetchBootstrap(),
        refetchNotifications(),
        refetchQuartermaster(),
      ]);
    } finally {
      setIsManualRefreshing(false);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="px-4 pt-2 pb-6"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isManualRefreshing}
          onRefresh={() => {
            void handleRefresh();
          }}
          tintColor={colors.primary}
        />
      }>
      <PilgrimageRoutePreview />
      {/*<PilgrimageLatestNewsSection onShowAll={onShowNews} />*/}
      <PilgrimageQuartermasterSection onShowAll={onShowQuartermaster} />
      <PilgrimageConferenceCard onPress={onShowConference} />
      <PilgrimageWeatherCard />
    </ScrollView>
  );
}
