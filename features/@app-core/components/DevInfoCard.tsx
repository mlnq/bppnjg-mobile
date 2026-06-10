import { Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { getCurrentPilgrimageDayFetchNumber } from '../hooks/useSelectedPilgrimageDay';
import { usePushDebugInfo } from '../hooks/usePushDebugInfo';
import { useRouteFallbackMode } from '../hooks/useRouteFallbackMode';
import {
  PILGRIMAGE_YEAR,
  useGetPilgrimageDayQuery,
  useGetPilgrimageQuery,
} from '../services/pilgrimageApi';
import { getApiBaseUrl } from '../services/backendConfig';
import type { AppDispatch } from '../store/store';
import { toggleRouteFallbackMode } from '../store/preferencesSlice';
import { formatDateTimeWithSeconds } from '../utils/formatters/formatDateTime';

const { colors, typography } = pilgrimageRouteTheme;

function formatDataSourceLabel(value: 'remote' | 'bundled-fallback' | undefined) {
  if (value === 'remote') {
    return 'Backend API';
  }

  if (value === 'bundled-fallback') {
    return 'Pliki awaryjne';
  }

  return 'Brak danych';
}

type DevInfoCardProps = {
  onReset?: () => void;
};

export function DevInfoCard({ onReset }: DevInfoCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const debugInfo = usePushDebugInfo();
  const routeFallbackMode = useRouteFallbackMode();
  const { data: pilgrimage } = useGetPilgrimageQuery(PILGRIMAGE_YEAR);
  const currentDayFetchNumber = getCurrentPilgrimageDayFetchNumber(pilgrimage?.totalDays);
  const { data: pilgrimageDay } = useGetPilgrimageDayQuery(
    {
      year: PILGRIMAGE_YEAR,
      dayNumber: currentDayFetchNumber ?? 1,
    },
    {
      skip: currentDayFetchNumber === null,
    }
  );
  const appVariant = Constants.expoConfig?.extra?.appVariant ?? 'production';
  const appId = Constants.expoConfig?.extra?.appId ?? 'Brak';
  const apiBaseUrl = getApiBaseUrl() ?? 'Brak';
  const routeDataSource =
    (pilgrimageDay ? 'remote' : undefined) ??
    (routeFallbackMode.isEnabled && routeFallbackMode.isHydrated ? 'bundled-fallback' : undefined);

  return (
    <View
      className="mb-6 rounded-[24px] border px-4 py-4"
      style={{ backgroundColor: '#fffaf3', borderColor: '#ead9c8' }}>
      <Text
        className="text-[13px] font-extrabold uppercase tracking-[1px]"
        style={{ color: '#9f6a2e', fontFamily: typography.fontFamily }}>
        Dev Info
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          onReset?.();
        }}
        className="mt-3 self-start rounded-full px-4 py-2"
        style={{ backgroundColor: '#f7ead8' }}>
        <Text
          className="text-[12px] font-bold uppercase tracking-[0.8px]"
          style={{ color: '#9f6a2e', fontFamily: typography.fontFamily }}>
          Reset dev opcji
        </Text>
      </TouchableOpacity>

      <View className="mt-4 gap-3">
        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            Wariant aplikacji
          </Text>
          <Text
            className="mt-1 text-[15px]"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {appVariant}
          </Text>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            App ID
          </Text>
          <Text
            className="mt-1 text-[15px]"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {appId}
          </Text>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            API Base URL
          </Text>
          <Text
            selectable
            className="mt-1 text-[14px] leading-6"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {apiBaseUrl}
          </Text>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            Źródło danych trasy
          </Text>
          <Text
            className="mt-1 text-[15px]"
            style={{
              color: colors.onSurface,
              fontFamily: typography.fontFamily,
            }}>
            {formatDataSourceLabel(routeDataSource)}
          </Text>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            Fallback trasy
          </Text>
          <Text
            className="mt-1 text-[15px]"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {routeFallbackMode.isEnabled ? 'Włączony ręcznie' : 'Wyłączony'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(toggleRouteFallbackMode());
            }}
            className="mt-3 self-start rounded-full px-4 py-2"
            style={{ backgroundColor: '#f3e3d1' }}>
            <Text
              className="text-[12px] font-bold uppercase tracking-[0.8px]"
              style={{ color: '#8b5b00', fontFamily: typography.fontFamily }}>
              {routeFallbackMode.isEnabled ? 'Odepnij fallback' : 'Podepnij fallback'}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            Token komunikacyjny
          </Text>
          <Text
            selectable
            className="mt-1 text-[14px] leading-6"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {debugInfo.token ?? 'Brak tokenu'}
          </Text>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            EAS Project ID
          </Text>
          <Text
            selectable
            className="mt-1 text-[14px] leading-6"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {debugInfo.projectId ?? 'Brak'}
          </Text>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            Status uprawnień
          </Text>
          <Text
            className="mt-1 text-[15px]"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            {debugInfo.permissionStatus ?? 'Brak danych'}
          </Text>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            Błąd rejestracji
          </Text>
          <Text
            selectable
            className="mt-1 text-[14px] leading-6"
            style={{
              color: debugInfo.registrationError ? '#9b3d3d' : colors.onSurfaceVariant,
              fontFamily: typography.fontFamily,
            }}>
            {debugInfo.registrationError ?? 'Brak'}
          </Text>
        </View>

        <View>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
            Ostatnia aktualizacja
          </Text>
          <Text
            className="mt-1 text-[15px]"
            style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
            {formatDateTimeWithSeconds(debugInfo.updatedAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}
