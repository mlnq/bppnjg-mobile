import { useState } from 'react';
import { Alert, Linking, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';

import { AppColors, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import { Card, CardButton } from '../../../components/Card';
import { DevInfoCard } from '../../../components/DevInfoCard';
import { useRouteLocationSource } from '../../../hooks/useRouteLocationSource';
import { useDevInfoVisibility } from '../../../hooks/useDevInfoVisibility';
import { useSelector } from 'react-redux';
import {
  type LocationSource,
  resetDevInfoVisibility,
  setDevSimulatedDayNumber,
  setRouteLocationSource,
} from '../../../store/preferencesSlice';
import type { RootState } from '../../../store/store';
import type { AppDispatch } from '../../../store/store';

const { colors, typography } = pilgrimageRouteTheme;

const locationSourceOptions: readonly {
  value: LocationSource;
  label: string;
  description: string;
}[] = [
  {
    value: 'auto',
    label: 'Auto',
    description: 'GPS, gdy jest dostępny. W innym wypadku harmonogram dnia.',
  },
  {
    value: 'gps-only',
    label: 'Tylko GPS',
    description: 'Preferuj wyłącznie GPS. Gdy go zabraknie, wynik pokaże fallback z planu.',
  },
  {
    value: 'time-only',
    label: 'Tylko godziny',
    description: 'Ignoruj GPS i licz pozycję wyłącznie z harmonogramu dnia.',
  },
] as const;

export function PilgrimageSettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [isCheckingGps, setIsCheckingGps] = useState(false);
  const devInfoVisibility = useDevInfoVisibility();
  const routeLocationSource = useRouteLocationSource();
  const devSimulatedDay = useSelector((s: RootState) => s.preferences.devSimulatedDayNumber);

  const DEV_DAY_MIN = 0;
  const DEV_DAY_MAX = 15;

  const devDayLabel = (day: number | null) => {
    if (day === null) return 'Prawdziwa data';
    if (day <= 0) return 'Przed pielgrzymką';
    if (day >= 15) return 'Po pielgrzymce';
    return `Dzień ${day} z 14`;
  };

  const handleOpenSystemSettings = () => {
    void Linking.openSettings();
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
        servicesEnabled ? null : 'Usługi lokalizacji są wyłączone na telefonie.',
        foregroundPermission.status === 'granted'
          ? null
          : 'Aplikacja nie ma zgody na dostęp do lokalizacji.',
      ].filter(Boolean);

      Alert.alert('GPS niedostępny', reasons.join(' '), [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Ustawienia systemowe',
          onPress: handleOpenSystemSettings,
        },
      ]);
    } catch {
      Alert.alert(
        'Błąd testu GPS',
        'Nie udało się sprawdzić stanu lokalizacji. Otwórz ustawienia systemowe i zweryfikuj uprawnienia ręcznie.',
        [
          { text: 'Anuluj', style: 'cancel' },
          {
            text: 'Ustawienia systemowe',
            onPress: handleOpenSystemSettings,
          },
        ]
      );
    } finally {
      setIsCheckingGps(false);
    }
  };

  const handleResetDevOptions = () => {
    dispatch(resetDevInfoVisibility());
  };

  return (
    <AppScreenScrollView
      className="flex-1"
      style={{ backgroundColor: AppColors.background }}
      contentContainerClassName="pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
      <Text
        className="mb-6 text-[16px] leading-6"
        style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
        Ustawienia aplikacji, uprawnienia i narzędzia diagnostyczne.
      </Text>

      <Card className="mb-4 rounded-[24px] px-4 py-4">
        <Text
          className="text-[12px] font-bold uppercase tracking-[0.8px]"
          style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
          Źródło pozycji na trasie
        </Text>
        <Text
          className="mt-2 text-[15px] leading-6"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          Wybierz, czy aplikacja ma liczyć trasę automatycznie, tylko z GPS, czy tylko z godzin
          z harmonogramu.
        </Text>

        {locationSourceOptions.map((option) => {
          const isActive = routeLocationSource.value === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.8}
              onPress={() => {
                dispatch(setRouteLocationSource(option.value));
              }}
              className="mt-4 rounded-[20px] border px-4 py-4"
              style={{
                backgroundColor: isActive ? '#f7ead8' : colors.surfaceContainerLowest,
                borderColor: isActive ? '#c98839' : colors.outlineVariant,
              }}>
              <Text
                className="text-[13px] font-bold uppercase tracking-[0.8px]"
                style={{
                  color: isActive ? '#8b5b00' : colors.onSurface,
                  fontFamily: typography.fontFamily,
                }}>
                {option.label}
              </Text>
              <Text
                className="mt-1 text-[14px] leading-6"
                style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                {option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Card>

      <Card className="mb-4 rounded-[24px] px-4 py-4">
        <Text
          className="text-[12px] font-bold uppercase tracking-[0.8px]"
          style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
          Uprawnienia
        </Text>
        <Text
          className="mt-2 text-[15px] leading-6"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          Jeśli chcesz zmienić zgodę na lokalizację albo powiadomienia, przejdziesz stąd do ustawień
          systemowych.
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOpenSystemSettings}
          className="mt-4 self-start rounded-full px-4 py-2"
          style={{ backgroundColor: '#f3e3d1' }}>
          <Text
            className="text-[12px] font-bold uppercase tracking-[0.8px]"
            style={{ color: '#8b5b00', fontFamily: typography.fontFamily }}>
            Otwórz ustawienia systemowe
          </Text>
        </TouchableOpacity>
      </Card>

      <CardButton
        activeOpacity={0.8}
        disabled={isCheckingGps}
        onPress={() => {
          void handleGpsDebug();
        }}
        className="mb-4 rounded-[24px] px-4 py-4"
        backgroundColor="#eef6ea"
        borderColor="#d5e5cf">
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
            : 'Sprawdź, czy lokalizacja działa poprawnie i czy aplikacja ma odpowiednie uprawnienia.'}
        </Text>
      </CardButton>

      <Card className="mb-4 rounded-[24px] px-4 py-4">
        <Text
          className="text-[12px] font-bold uppercase tracking-[0.8px]"
          style={{ color: '#b00020', fontFamily: typography.fontFamily }}>
          DEV · Symulator dnia
        </Text>
        <Text
          className="mt-2 text-[15px] font-semibold"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          {devDayLabel(devSimulatedDay)}
        </Text>
        <Text
          className="mb-4 mt-1 text-[13px]"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          {devSimulatedDay === null
            ? 'Używana jest prawdziwa data urządzenia.'
            : 'Nadpisana ręcznie. Reset → prawdziwa data.'}
        </Text>
        <TouchableOpacity
          className="flex-row items-center gap-3"
          activeOpacity={1}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              const current = devSimulatedDay ?? DEV_DAY_MIN;
              dispatch(setDevSimulatedDayNumber(Math.max(DEV_DAY_MIN, current - 1)));
            }}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.surfaceContainerHigh }}>
            <Text
              className="text-[20px] font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              −
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              const current = devSimulatedDay ?? DEV_DAY_MIN;
              dispatch(setDevSimulatedDayNumber(Math.min(DEV_DAY_MAX, current + 1)));
            }}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.surfaceContainerHigh }}>
            <Text
              className="text-[20px] font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              +
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => dispatch(setDevSimulatedDayNumber(null))}
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: '#fde8e8' }}>
            <Text
              className="text-[12px] font-bold uppercase tracking-[0.8px]"
              style={{ color: '#b00020', fontFamily: typography.fontFamily }}>
              Reset
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Card>

      {devInfoVisibility.isEnabled ? <DevInfoCard onReset={handleResetDevOptions} /> : null}
    </AppScreenScrollView>
  );
}
