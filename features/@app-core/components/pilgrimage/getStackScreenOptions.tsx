import type {
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { pilgrimageRouteTheme } from '../../../packages/@app-ui';
import { HeaderBackButton } from './HeaderBackButton';
import { SettingsButton } from './SettingsButton';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageStackScreenOptionsConfig = {
  hideBackRoutes?: ReadonlySet<string>;
  showSettingsRoutes?: ReadonlySet<string>;
};

export function getPilgrimageStackScreenOptions({
  hideBackRoutes = new Set<string>(),
  showSettingsRoutes,
}: PilgrimageStackScreenOptionsConfig = {}) {
  return ({
    route,
    navigation,
  }: {
    route: {
      name: string;
    };
    navigation: {
      canGoBack: () => boolean;
      goBack: () => void;
    };
  }): NativeStackNavigationOptions => {
    const hideBackAction = hideBackRoutes.has(route.name);
    const showSettingsAction = showSettingsRoutes?.has(route.name) ?? false;
    const showBackButton = !hideBackAction && navigation.canGoBack();
    const headerRight = showSettingsAction ? () => <SettingsButton /> : undefined;
    const headerLeft = showBackButton
      ? () => <HeaderBackButton onPress={() => navigation.goBack()} />
      : undefined;

    return {
      headerBackVisible: false,
      headerShadowVisible: false,
      headerTransparent: false,
      headerStyle: {
        backgroundColor: '#fcfaf7',
      },
      headerTitleStyle: {
        color: colors.onSurface,
        fontFamily: typography.fontFamily,
        fontSize: 24,
        fontWeight: '700',
      },
      headerTintColor: colors.onSurface,
      headerTitleAlign: 'center',
      headerLeft,
      headerRight,
    };
  };
}
