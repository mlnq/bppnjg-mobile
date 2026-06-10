import { Text, TouchableOpacity, View } from 'react-native';

import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { useCompactStyles } from '../../../hooks/useCompactStyles';
import type { BreviaryOfficeId } from '../../../services/brewiarzApi';
import { OFFICE_OPTIONS } from '../helpers/pilgrimageBreviary.helpers';

const { typography } = pilgrimageRouteTheme;
const BREVIARY_ACCENT = '#2563EB';
const BREVIARY_ACCENT_SOFT = '#EFF6FF';
const BREVIARY_ACCENT_BORDER = '#BFDBFE';

type OfficeTabsProps = {
  value: BreviaryOfficeId;
  onChange: (office: BreviaryOfficeId) => void;
};

export function OfficeTabs({ value, onChange }: OfficeTabsProps) {
  const { cs } = useCompactStyles();

  return (
    <View className="mt-5 flex-row flex-wrap gap-2">
      {OFFICE_OPTIONS.map((option) => {
        const isActive = option.id === value;

        return (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.8}
            onPress={() => onChange(option.id)}
            className="rounded-full border px-4 py-2"
            style={{
              borderColor: isActive ? BREVIARY_ACCENT : BREVIARY_ACCENT_BORDER,
              backgroundColor: isActive ? BREVIARY_ACCENT : BREVIARY_ACCENT_SOFT,
            }}>
            <Text
              className={cs('text-[13px] font-semibold', 'text-[14px] font-semibold')}
              style={{
                color: isActive ? '#FFFFFF' : BREVIARY_ACCENT,
                fontFamily: typography.fontFamily,
              }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
