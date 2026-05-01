import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { type QuartermasterComment, useGetQuartermasterCommentsQuery } from '../../../services/quartermasterApi';
import { PilgrimageQuartermasterCard } from '../components/PilgrimageQuartermasterCard';

const { colors, typography } = pilgrimageRouteTheme;

export function PilgrimageQuartermasterScreen() {
  const router = useRouter();
  const { data, isLoading, isFetching, isError } = useGetQuartermasterCommentsQuery();
  const hasItems = Boolean(data?.length);

  const handleOpenDetail = (item: QuartermasterComment) => {
    router.push(`/quartermaster/${item.id}`);
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="px-4 pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
      <View className="mb-2 flex-row items-center justify-between gap-3">
        <Text
          className="text-[28px] font-bold"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          Kwatermistrz
        </Text>
      </View>
      <Text
        className="mb-6 text-[16px] leading-6"
        style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
        Lista komentarzy kwatermistrza. Kluczowe są data publikacji oraz tytuł wpisu.
      </Text>

      {isLoading || isFetching ? (
        <AppLoader label="Pobieranie wieści kwatermistrzowskich..." minHeight={180} />
      ) : isError ? (
        <Text
          className="text-[16px] leading-7"
          style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
          Nie udało się pobrać wieści kwatermistrzowskich.
        </Text>
      ) : !hasItems ? (
        <Text
          className="text-[16px] leading-7"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          Brak opublikowanych komentarzy kwatermistrza.
        </Text>
      ) : (
        <View className="gap-4">
          {data?.map((item) => (
            <PilgrimageQuartermasterCard key={item.id} item={item} onPress={handleOpenDetail} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
