import { ScrollView, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREEN_HORIZONTAL_PADDING_CLASS } from '../constants/layout';
import { BOTTOM_NAV_HEIGHT } from './PilgrimageBottomNav';

type AppScreenScrollViewProps = ScrollViewProps & {
  contentContainerClassName?: string;
};

export function AppScreenScrollView({
  contentContainerClassName,
  contentContainerStyle,
  scrollIndicatorInsets,
  ...props
}: AppScreenScrollViewProps) {
  const insets = useSafeAreaInsets();
  const paddedContentContainerClassName =
    `${SCREEN_HORIZONTAL_PADDING_CLASS} ${contentContainerClassName ?? ''}`.trim();
  const bottomInset = BOTTOM_NAV_HEIGHT + Math.max(insets.bottom, 12);

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
