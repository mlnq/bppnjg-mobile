import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import Footprints from 'lucide-react-native/dist/esm/icons/footprints.mjs';

import { StartSectionCard } from './StartSectionCard';

const { colors } = pilgrimageRouteTheme;

type PilgrimageConferenceCardProps = {
  title?: string;
  onPress?: () => void;
};

export function PilgrimageConferenceCard({ title, onPress }: PilgrimageConferenceCardProps) {
  return (
    <StartSectionCard
      icon={<Footprints size={26} color={colors.primary} strokeWidth={1.8} />}
      title={title ?? 'Konferencja zostanie dodana przed etapem'}
      subtitle="Konferencja dnia z trasy"
      onPress={onPress}
    />
  );
}
