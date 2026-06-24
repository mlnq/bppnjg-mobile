import { ScrollView, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREEN_HORIZONTAL_PADDING_CLASS } from '../constants/layout';
import { BOTTOM_NAV_HEIGHT } from './pilgrimage/BottomNav';

type AppScreenScrollViewProps = ScrollViewProps & {
  contentContainerClassName?: string;
  withoutBottomNav?: boolean;
};

export function AppScreenScrollView({
  contentContainerClassName,
  contentContainerStyle,
  scrollIndicatorInsets,
  withoutBottomNav = false,
  ...props
}: AppScreenScrollViewProps) {
  const insets = useSafeAreaInsets();
  const paddedContentContainerClassName =
    `${SCREEN_HORIZONTAL_PADDING_CLASS} ${contentContainerClassName ?? ''}`.trim();
  const bottomInset = withoutBottomNav
    ? Math.max(insets.bottom, 20)
    : BOTTOM_NAV_HEIGHT + Math.max(insets.bottom, 12);

  return (
    <ScrollView
      {...props}
      contentContainerClassName={paddedContentContainerClassName}
      contentContainerStyle={[
        {
          paddingBottom: bottomInset,
        },
        contentContainerStyle,
      ]}
      scrollIndicatorInsets={{
        bottom: bottomInset,
        ...scrollIndicatorInsets,
      }}
    />
  );
}
