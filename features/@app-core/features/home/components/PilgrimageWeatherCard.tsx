import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Thermometer from 'lucide-react-native/dist/esm/icons/thermometer.mjs';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { Card } from '../../../components/Card';
import { useCompactStyles } from '../../../hooks/useCompactStyles';
import { usePilgrimageWeather } from '../../../hooks/usePilgrimageWeather';
import { formatHourMinute } from '../../../utils/formatters/formatDateTime';
import { WeatherIcon } from './WeatherIcon';

const { colors, typography } = pilgrimageRouteTheme;

export function PilgrimageWeatherCard() {
  const { cs } = useCompactStyles();
  const { weather, hourlyForecast, isLoading, error } = usePilgrimageWeather();
  const [isExpanded, setIsExpanded] = useState(false);
  const weatherSummary = isLoading
    ? 'Pobieranie aktualnej pogody...'
    : error
      ? 'Aktualna prognoza chwilowo niedostępna.'
      : weather.summary;

  return (
    <Card
      className="mt-[18px] rounded-[28px] border px-6 py-6"
      >
      <Text
        className={cs('text-[17px] font-bold', 'text-[18px] font-bold')}
        style={{ color: '#172033', fontFamily: typography.fontFamily }}>
        Pogoda na trasie
      </Text>

      <View className="mt-7 flex-row items-center gap-4">
        <View
          className="h-[54px] w-[54px] items-center justify-center rounded-full"
          style={{ backgroundColor: '#FFF4DA' }}>
          <Thermometer size={28} color="#F59E0B" strokeWidth={2.1} />
        </View>
        <View className="w-[116px]">
          <View className="flex-row items-end">
            <Text
              className={cs('text-[24px] font-bold leading-[30px]', 'text-[28px] font-bold leading-[34px]')}
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {weather.temperatureC}°
            </Text>
            <Text
              className={cs('ml-1 text-[24px] font-bold leading-[30px]', 'ml-1 text-[28px] font-bold leading-[34px]')}
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              C
            </Text>
          </View>
          <Text
            numberOfLines={2}
            className={cs('text-[14px] leading-5', 'text-[15px] leading-6')}
            style={{ color: '#667085', fontFamily: typography.fontFamily }}>
            {weatherSummary}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => setIsExpanded((value) => !value)}
          className="ml-auto shrink rounded-full px-5 py-3"
          style={{ backgroundColor: '#FFF1BF' }}>
          <Text
            className={cs('text-[13px] font-semibold', 'text-[14px] font-semibold')}
            style={{ color: '#C96B00', fontFamily: typography.fontFamily }}>
            {isExpanded ? 'Ukryj więcej' : 'Pokaż więcej'}
          </Text>
        </TouchableOpacity>
      </View>

      {isExpanded ? (
        <View className="mt-5 border-t pt-5" style={{ borderTopColor: '#eef1f4' }}>
          {hourlyForecast.length > 0 ? (
            <View className="gap-0">
              {hourlyForecast.map((item) => (
                <View
                  key={item.time}
                  className="flex-row items-center py-4"
                  style={{
                    borderBottomWidth: item === hourlyForecast[hourlyForecast.length - 1] ? 0 : 1,
                    borderBottomColor: '#eef1f4',
                  }}>
                  <Text
                    className={cs('w-[72px] text-[15px] font-medium', 'w-[72px] text-[17px] font-medium')}
                    style={{ color: '#3F4B5F', fontFamily: typography.fontFamily }}>
                    {formatHourMinute(item.time)}
                  </Text>
                  <View className="flex-1 items-center">
                    <WeatherIcon icon={item.icon} isDay={item.isDay} />
                  </View>
                  <View className="w-[76px] items-end">
                    <Text
                      className={cs('text-[15px] font-medium', 'text-[17px] font-medium')}
                      style={{ color: '#3F4B5F', fontFamily: typography.fontFamily }}>
                      {item.temperatureC}°C
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text
              className="text-sm leading-5"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              Prognoza godzinowa chwilowo niedostępna.
            </Text>
          )}
        </View>
      ) : null}
    </Card>
  );
}
