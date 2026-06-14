import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { pilgrimageRouteTheme } from '../../../../packages/@app-ui';
import { HeaderBackButton } from '../HeaderBackButton';

const { colors, typography } = pilgrimageRouteTheme;

// Properties shared between NativeStack and BottomTab navigators
export type SharedHeaderOptions = Pick<
  NativeStackNavigationOptions,
  | 'headerShadowVisible'
  | 'headerTransparent'
  | 'headerStyle'
  | 'headerTitleStyle'
  | 'headerTintColor'
  | 'headerTitleAlign'
>;

export const sharedHeaderStyles: SharedHeaderOptions = {
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
};

type PilgrimageStackScreenOptionsConfig = {
  hideBackRoutes?: ReadonlySet<string>;
};

export function getPilgrimageStackScreenOptions({
  hideBackRoutes = new Set<string>(),
}: PilgrimageStackScreenOptionsConfig = {}) {
  return ({
    route,
    navigation,
  }: {
    route: { name: string };
    navigation: { canGoBack: () => boolean; goBack: () => void };
  }): NativeStackNavigationOptions => {
    const showBackButton = !hideBackRoutes.has(route.name) && navigation.canGoBack();
    const headerLeft = showBackButton
      ? () => <HeaderBackButton onPress={() => navigation.goBack()} />
      : undefined;

    return {
      ...sharedHeaderStyles,
      headerBackVisible: false,
      headerLeft,
    };
  };
}
