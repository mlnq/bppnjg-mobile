import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { AppLoader } from '../../../components/AppLoader';
import { AppScreenScrollView } from '../../../components/AppScreenScrollView';
import {
  type QuartermasterComment,
  useGetQuartermasterCommentsQuery,
} from '../../../services/quartermasterApi';
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
    <AppScreenScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="pt-5 pb-6"
      showsVerticalScrollIndicator={false}>
      <Text
        className="text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: '#7f766d', fontFamily: typography.fontFamily }}>
        Dziennik dnia
      </Text>
      <View className="mb-2 mt-2 flex-row items-center justify-between gap-3">
        <Text
          className="text-[32px] font-bold"
          style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
          Kwatermistrz
        </Text>
      </View>
      <Text
        className="mb-6 text-[16px] leading-7"
        style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
        Wieczorne komentarze z trasy. Najnowsze wpisy pokazują dzień pielgrzymki, datę publikacji i
        tytuł komunikatu.
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
        <View>
          <Text
            className="mb-4 text-[20px] font-bold"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            Poprzednie komentarze
          </Text>
          <View className="gap-4">
            {data?.map((item) => (
              <PilgrimageQuartermasterCard key={item.id} item={item} onPress={handleOpenDetail} />
            ))}
          </View>
        </View>
      )}
    </AppScreenScrollView>
  );
}
