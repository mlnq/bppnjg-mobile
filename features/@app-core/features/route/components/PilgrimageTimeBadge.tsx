import { View, Text } from 'react-native';
import { pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { formatDurationMinutes } from '../../../utils/formatters/formatDurationMinutes';
import {Timer} from "lucide-react-native";

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageTimeBadgeProps = {
    durationMin: number;
    isCurrentStop: boolean;
};

export function PilgrimageTimeBadge({
                                        durationMin,
                                        isCurrentStop,
                                    }: PilgrimageTimeBadgeProps) {
    if (durationMin <= 0) return null;

    const iconColor = isCurrentStop ? colors.onPrimary : colors.onSurface;
    const bgColor = isCurrentStop
        ? 'rgba(255,255,255,0.18)'
        : colors.surfaceContainerLow ?? 'rgba(0,0,0,0.06)';

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: bgColor,
            }}
        >
            <Timer size={15} color={iconColor} strokeWidth={2.3} />
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: '800',
                    letterSpacing: 0.9,
                    textTransform: 'uppercase',
                    color: iconColor,
                    fontFamily: typography.fontFamily,
                }}
            >
                {formatDurationMinutes(durationMin)}
            </Text>
        </View>
    );
}
