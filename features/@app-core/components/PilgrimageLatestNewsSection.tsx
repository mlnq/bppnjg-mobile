import { Text, TouchableOpacity, View } from 'react-native';

import { NewsIcon, pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { PilgrimageNewsCard } from '../features/news/components/PilgrimageNewsCard';
import { useGetPilgrimageNotificationsQuery } from '../services/notificationsApi';
import { AppLoader } from './AppLoader';
import { CardButton } from './Card';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageLatestNewsSectionProps = {
  onShowAll?: () => void;
};

export function PilgrimageLatestNewsSection({ onShowAll }: PilgrimageLatestNewsSectionProps) {
  const { data, isLoading, isFetching, isError } = useGetPilgrimageNotificationsQuery();
  const latestNews = data?.[0];
  const handleOpenNews = () => {
    onShowAll?.();
  };

  return (
    <CardButton
      activeOpacity={0.9}
      onPress={handleOpenNews}
      className="mt-7 rounded-[26px] px-4 py-5"
      borderColor="#e1e3e4">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View
            className="mr-3 h-11 w-11 items-center justify-center rounded-[14px]"
            style={{ backgroundColor: colors.primaryContainer }}>
            <NewsIcon size={20} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text
              className="text-[20px] font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              Info z trasy
            </Text>
          </View>
        </View>
      </View>
      {isLoading || isFetching ? (
        <AppLoader compact label="Pobieranie informacji z trasy..." minHeight={120} />
      ) : isError ? (
        <Text
          className="text-[15px] leading-6"
          style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
          Nie udało się pobrać informacji z systemu powiadomień.
        </Text>
      ) : latestNews ? (
        <View>
          <PilgrimageNewsCard item={latestNews} compact />
          <TouchableOpacity activeOpacity={0.75} onPress={handleOpenNews}>
            <Text
              className="mt-3 text-[15px] font-semibold"
              style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
              Zobacz wszystkie informacje
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </CardButton>
  );
}
