import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { SCREEN_HORIZONTAL_PADDING_CLASS } from '../constants/layout';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageRouteLocationInfoModalProps = {
  visible: boolean;
  modalDescription: string;
  scheduleSourceLabel?: string | null;
  onClose: () => void;
};

export function PilgrimageRouteLocationInfoModal({
  visible,
  modalDescription,
  scheduleSourceLabel,
  onClose,
}: PilgrimageRouteLocationInfoModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        className={`flex-1 justify-end ${SCREEN_HORIZONTAL_PADDING_CLASS} pb-6 pt-12`}
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <View
          className="rounded-[24px] px-5 py-5"
          style={{ backgroundColor: colors.surfaceContainerLowest }}>
          <Text
            className="text-[16px] font-bold"
            style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
            Jak wyznaczamy pozycję na trasie
          </Text>
          <Text
            className="mt-3 text-[15px] leading-7"
            style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
            {modalDescription}
          </Text>
          {scheduleSourceLabel ? (
            <Text
              className="mt-3 text-[12px] font-medium uppercase tracking-[0.8px]"
              style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
              Aktualnie: {scheduleSourceLabel}
            </Text>
          ) : null}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="mt-5 self-end rounded-full px-4 py-2"
            style={{ backgroundColor: colors.primaryContainer }}>
            <Text
              className="text-[12px] font-bold uppercase tracking-[0.8px]"
              style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
              Zamknij
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
