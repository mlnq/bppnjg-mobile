import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { DevInfoCard } from '../../../components/DevInfoCard';
import { clearStoredNotificationNewsItems } from '../../../services/localNotificationNews';
import { writeNotificationsLastSeenAt } from '../../../services/notificationSeen';
import { useDevInfoVisibility } from '../../../hooks/useDevInfoVisibility';
import { resetDevInfoVisibility } from '../../../services/devInfoVisibility';
import {
  notificationsApi,
  useGetPilgrimageNotificationsQuery,
} from '../../../services/notificationsApi';
import { store } from '../../../store/store';
import { PilgrimageNewsCard } from '../components/PilgrimageNewsCard';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageNewsScreenProps = {
  showStandaloneHeader?: boolean;
  onClose?: () => void;
};

export function PilgrimageNewsScreen({
  showStandaloneHeader = true,
  onClose,
}: PilgrimageNewsScreenProps) {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const [isCheckingGps, setIsCheckingGps] = useState(false);
  const devInfoVisibility = useDevInfoVisibility();
  const [isDevSectionVisible, setIsDevSectionVisible] = useState(devInfoVisibility.isEnabled);
  const { data, isLoading, isFetching, isError } = useGetPilgrimageNotificationsQuery();
  const hasNotifications = Boolean(data?.length);
  const isInitialLoading = (isLoading || isFetching) && !data;

  useEffect(() => {
    setIsDevSectionVisible(devInfoVisibility.isEnabled);
  }, [devInfoVisibility.isEnabled]);

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

  const handleGpsDebug = async () => {
    if (isCheckingGps) {
      return;
    }

    setIsCheckingGps(true);

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      const foregroundPermission = await Location.getForegroundPermissionsAsync();

      if (servicesEnabled && foregroundPermission.status === 'granted') {
        Alert.alert(
          'GPS działa',
          'Usługi lokalizacji są włączone i aplikacja ma zgodę na dostęp do lokalizacji.'
        );
        return;
      }

      const reasons = [
        servicesEnabled ? null : 'Usługi lokalizacji są wyłączone na iPhonie.',
        foregroundPermission.status === 'granted'
          ? null
          : 'Aplikacja nie ma zgody na dostęp do lokalizacji.',
      ].filter(Boolean);

      Alert.alert(
        'GPS niedostępny',
        reasons.join(' '),
        [
          { text: 'Anuluj', style: 'cancel' },
          {
            text: 'Otwórz ustawienia',
            onPress: () => {
              void Linking.openSettings();
            },
          },
        ]
      );
    } catch {
      Alert.alert(
        'Błąd testu GPS',
        'Nie udało się sprawdzić stanu lokalizacji. Otwórz ustawienia i zweryfikuj uprawnienia ręcznie.',
        [
          { text: 'Anuluj', style: 'cancel' },
          {
            text: 'Otwórz ustawienia',
            onPress: () => {
              void Linking.openSettings();
            },
          },
        ]
      );
    } finally {
      setIsCheckingGps(false);
    }
  };

  const handleResetDevOptions = () => {
    setIsDevSectionVisible(false);
    void resetDevInfoVisibility();
  };

  const handleOpenNotificationTarget = (targetRoute?: string) => {
    if (!targetRoute || targetRoute === '/news') {
      return;
    }

    router.push(targetRoute);
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="px-4 pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
      <View className={showStandaloneHeader ? 'mb-2 flex-row items-center justify-between gap-3' : 'mb-6 flex-row justify-end'}>
        {showStandaloneHeader ? (
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
        ) : null}
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
      {showStandaloneHeader ? (
        <Text
          className="mb-6 text-[16px] leading-6"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          Wszystkie komunikaty, aktualizacje i powiadomienia z trasy.
        </Text>
      ) : null}

      {isDevSectionVisible ? (
        <>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isCheckingGps}
            onPress={() => {
              void handleGpsDebug();
            }}
            className="mb-4 rounded-2xl px-4 py-4"
            style={{ backgroundColor: '#eef6ea' }}>
            <Text
              className="text-[12px] font-bold uppercase tracking-[0.8px]"
              style={{ color: '#2f5d2c', fontFamily: typography.fontFamily }}>
              Debug GPS
            </Text>
            <Text
              className="mt-1 text-[15px] leading-6"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {isCheckingGps
                ? 'Sprawdzanie lokalizacji...'
                : 'Sprawdź, czy GPS jest włączony. Jeśli nie, otwórz ustawienia systemowe.'}
            </Text>
          </TouchableOpacity>

          <DevInfoCard onReset={handleResetDevOptions} />
        </>
      ) : null}

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
    </ScrollView>
  );
}
