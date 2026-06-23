import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { clearStoredNotificationNewsItems } from '../../../services/localNotificationNews';
import { writeNotificationsLastSeenAt } from '../../../services/notificationSeen';
import {
  notificationsApi,
  useGetPilgrimageNotificationsQuery,
} from '../../../services/notificationsApi';
import { store } from '../../../store/store';
import { PilgrimageNewsCard } from '../components/NewsCard';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageNewsScreenProps = {
  onClose?: () => void;
};

export function PilgrimageNewsScreen({
  onClose,
}: PilgrimageNewsScreenProps) {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const { data, isLoading, isFetching, isError } = useGetPilgrimageNotificationsQuery();
  const hasNotifications = Boolean(data?.length);
  const isInitialLoading = (isLoading || isFetching) && !data;

  useEffect(() => {
    const latestPublishedAt = data?.[0]?.publishedAt;

    if (!latestPublishedAt) {
      return;
    }

    void writeNotificationsLastSeenAt(latestPublishedAt);
  }, [data]);

  const handleClearHistory = async () => {
    if (isClearing) {
      return;
    }

    setIsClearing(true);

    try {
      await clearStoredNotificationNewsItems();
      store.dispatch(notificationsApi.util.invalidateTags(['PilgrimageNotifications']));
    } finally {
      setIsClearing(false);
    }
  };

  const handleOpenNotificationTarget = (targetRoute?: string) => {
    if (!targetRoute || targetRoute === '/news') {
      return;
    }

    router.push(targetRoute);
  };

  return (
    <AppScreenScrollView
      className="flex-1"
      style={{ backgroundColor: AppColors.background }}
      contentContainerClassName="pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
      <View className={'mb-2 flex-row items-center justify-between gap-3'}>
          <>
            {onClose && (
              <TouchableOpacity onPress={onClose} className="p-2">
                <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
              </TouchableOpacity>
            )}
            <Text
              className="text-[28px] font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              Info
            </Text>
          </>
        <TouchableOpacity
          disabled={!hasNotifications || isClearing}
          activeOpacity={0.8}
          onPress={() => {
            void handleClearHistory();
          }}
          className="px-1 py-2">
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{
              color: !hasNotifications || isClearing ? '#9ca0a7' : colors.primary,
              fontFamily: typography.fontFamily,
            }}>
            {isClearing ? 'Czyszczenie...' : 'Wyczyść historię'}
          </Text>
        </TouchableOpacity>
      </View>
        <Text
          className="mb-6 text-[16px] leading-6"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          Wszystkie komunikaty, aktualizacje i powiadomienia z trasy.
        </Text>

      {isInitialLoading ? (
        <AppLoader label="Pobieranie informacji z trasy..." minHeight={180} />
      ) : isError ? (
        <Text
          className="text-[16px] leading-7"
          style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
          Nie udało się pobrać informacji z systemu powiadomień.
        </Text>
      ) : !hasNotifications ? (
        <Text
          className="text-[16px] leading-7"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          Historia powiadomień jest pusta.
        </Text>
      ) : (
        <View className="gap-4">
          {data?.map((item) => (
            <PilgrimageNewsCard
              key={item.id}
              item={item}
              onPress={item.targetRoute ? () => handleOpenNotificationTarget(item.targetRoute) : undefined}
            />
          ))}
        </View>
      )}
    </AppScreenScrollView>
  );
}
