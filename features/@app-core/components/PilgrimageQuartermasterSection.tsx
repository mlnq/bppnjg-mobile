import { Text } from 'react-native';
import CircleAlert from 'lucide-react-native/dist/esm/icons/circle-alert.mjs';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { useGetQuartermasterCommentsQuery } from '../services/quartermasterApi';
import { formatDateShort } from '../utils/formatters/formatDateTime';
import { StartSectionCard } from './StartSectionCard';
import { StartSectionCardSkeleton } from './StartSectionCardSkeleton';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageQuartermasterSectionProps = {
  onShowAll?: () => void;
};

export function PilgrimageQuartermasterSection({ onShowAll }: PilgrimageQuartermasterSectionProps) {
  const { data, isLoading, isFetching, isError } = useGetQuartermasterCommentsQuery();
  const latestItem = data?.[0];

  if (isLoading || isFetching) {
    return <StartSectionCardSkeleton />;
  }

  if (isError) {
    return (
      <Text
        className="mt-5 text-[15px] leading-6"
        style={{ color: '#9b3d3d', fontFamily: typography.fontFamily }}>
        Nie udało się pobrać komentarza kwatermistrza.
      </Text>
    );
  }

  if (!latestItem) {
    return (
      <Text
        className="mt-5 text-[15px] leading-6"
        style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
        Brak opublikowanych komentarzy kwatermistrza.
      </Text>
    );
  }

  return (
    <StartSectionCard
      icon={<CircleAlert size={26} color={colors.primary} strokeWidth={1.8} />}
      title="Komentarz kwatermistrza"
      subtitle={`Dzień ${latestItem.dayNumber ?? '?'} • ${formatDateShort(latestItem.publishedAt)}`}
      onPress={onShowAll}
    />
  );
}
