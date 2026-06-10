import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { AppLoader } from '../../../features/@app-core/components/AppLoader';
import { AppScreenScrollView } from '../../../features/@app-core/components/AppScreenScrollView';
import {
  type QuartermasterComment,
  useGetQuartermasterCommentsQuery,
} from '../../../features/@app-core/services/quartermasterApi';
import { formatDateTimeShort } from '../../../features/@app-core/utils/formatters/formatDateTime';

const { colors, radii, typography } = pilgrimageRouteTheme;
const CARD_BORDER = '#e4dbd1';
const BADGE_BACKGROUND = '#fff1de';
const BADGE_TEXT = '#a56d1f';

export default function QuartermasterDetailRoute() {
  const { commentId } = useLocalSearchParams<{ commentId: string }>();
  const { data, isLoading, isFetching, isError } = useGetQuartermasterCommentsQuery();
  const item = data?.find((entry: QuartermasterComment) => entry.id === commentId);

  return (
    <>
      <Stack.Screen options={{ title: item?.title ?? 'Kwatermistrz' }} />
      <AppScreenScrollView
        className="flex-1"
        style={{ backgroundColor: colors.surface }}
        contentContainerClassName="pt-6 pb-6"
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
            style={{ backgroundColor: '#ffffff', borderColor: CARD_BORDER, borderRadius: radii.md }}>
            <View className="mb-4 flex-row items-start justify-between gap-3">
              <View className="flex-1 flex-row items-start gap-4">
                <View
                  className="h-[58px] w-[58px] items-center justify-center rounded-[18px]"
                  style={{ backgroundColor: BADGE_BACKGROUND }}>
                  <Text
                    className="text-[25px] font-bold"
                    style={{ color: BADGE_TEXT, fontFamily: typography.fontFamily }}>
                    D{item.dayNumber ?? '?'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[11px] font-medium uppercase tracking-[0.8px]"
                    style={{ color: '#7f766d', fontFamily: typography.fontFamily }}>
                    Opublikowano {formatDateTimeShort(item.publishedAt)}
                  </Text>
                  <Text
                    className="mt-2 text-[24px] font-bold leading-8"
                    style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
                    {item.title}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              className="text-[16px] leading-7"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {item.content}
            </Text>
          </View>
        )}
      </AppScreenScrollView>
    </>
  );
}
