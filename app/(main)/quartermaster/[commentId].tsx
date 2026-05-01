import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { PrayerHandsIcon, pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { AppLoader } from '../../../features/@app-core/components/AppLoader';
import {
  type QuartermasterComment,
  useGetQuartermasterCommentsQuery,
} from '../../../features/@app-core/services/quartermasterApi';

const { colors, radii, typography } = pilgrimageRouteTheme;

function formatPublishedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Bez daty';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function QuartermasterDetailRoute() {
  const { commentId } = useLocalSearchParams<{ commentId: string }>();
  const { data, isLoading, isFetching, isError } = useGetQuartermasterCommentsQuery();
  const item = data?.find((entry: QuartermasterComment) => entry.id === commentId);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="px-4 pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
      {isLoading || isFetching ? (
        <AppLoader label="Pobieranie szczegółu komentarza..." minHeight={220} />
      ) : isError || !item ? (
        <Text
          className="text-[16px] leading-7"
          style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
          Nie udało się otworzyć szczegółu komentarza kwatermistrza.
        </Text>
      ) : (
        <View
          className="rounded-[24px] border px-5 py-5"
          style={{ backgroundColor: '#fbf7f2', borderColor: '#ead9c8', borderRadius: radii.md }}>
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text
                className="text-[11px] font-medium uppercase tracking-[0.8px]"
                style={{ color: '#8f9298', fontFamily: typography.fontFamily }}>
                DZIEŃ {item.dayNumber ?? '?'} • {formatPublishedAt(item.publishedAt)}
              </Text>
              <Text
                className="mt-2 text-[24px] font-bold leading-8"
                style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
                {item.title}
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-white">
              <PrayerHandsIcon size={22} color="#9f6a2e" />
            </View>
          </View>

          <Text
            className="text-[16px] leading-7"
            style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
            {item.content}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
