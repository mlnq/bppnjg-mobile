import { Text, TouchableOpacity, View } from 'react-native';
import CircleAlert from 'lucide-react-native/dist/esm/icons/circle-alert.mjs';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { useGetQuartermasterCommentsQuery } from '../services/quartermasterApi';
import { AppLoader } from './AppLoader';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageQuartermasterSectionProps = {
  onShowAll?: () => void;
};

function formatPublishedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Bez daty';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function PilgrimageQuartermasterSection({ onShowAll }: PilgrimageQuartermasterSectionProps) {
  const { data, isLoading, isFetching, isError } = useGetQuartermasterCommentsQuery();
  const latestItem = data?.[0];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onShowAll}
      className="mt-7 rounded-[26px] px-6 py-6"
      style={{
        backgroundColor: '#FFF8E2',
        borderWidth: 2,
        borderColor: '#F7D85A',
        shadowColor: '#8b6a1b',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      {isLoading || isFetching ? (
        <AppLoader compact label="Pobieranie wieści kwatermistrzowskich..." minHeight={120} />
      ) : isError ? (
        <Text
          className="text-[15px] leading-6"
          style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
          Nie udało się pobrać komentarza kwatermistrza.
        </Text>
      ) : latestItem ? (
        <View className="flex-row items-start gap-4">
          <View
            className="h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: '#FFE082' }}>
            <CircleAlert size={30} color="#B86A00" strokeWidth={2.1} />
          </View>
          <View className="flex-1 pr-1">
            <Text
              className="text-[21px] font-bold"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              Komentarz kwatermistrza
            </Text>
            <Text
              className="mt-1 text-[12px] font-bold uppercase tracking-[0.8px]"
              style={{ color: '#5B667A', fontFamily: typography.fontFamily }}>
              DZIEŃ {latestItem.dayNumber ?? '?'} • {formatPublishedAt(latestItem.publishedAt)}
            </Text>
            <Text
              className="mt-4 text-[18px] leading-8"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              Pojawił się nowy komentarz kwatermistrza.
            </Text>
          </View>
        </View>
      ) : (
        <Text
          className="text-[15px] leading-6"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          Brak opublikowanych komentarzy kwatermistrza.
        </Text>
      )}
    </TouchableOpacity>
  );
}
