import { View } from 'react-native';

import { Card } from './Card';

const SKELETON_BASE = '#f3f1f5';
const SKELETON_STRONG = '#ebe7ef';

export function StartSectionCardSkeleton() {
  return (
    <Card className="mt-5 flex-row items-center rounded-[24px] border px-5 py-5" borderColor="#ececf0">
      <View
        className="mr-4 h-[56px] w-[56px] rounded-[18px]"
        style={{ backgroundColor: SKELETON_STRONG }}
      />

      <View className="flex-1 pr-3">
        <View
          className="h-[18px] w-[72%] rounded-full"
          style={{ backgroundColor: SKELETON_STRONG }}
        />
        <View
          className="mt-3 h-[14px] w-[54%] rounded-full"
          style={{ backgroundColor: SKELETON_BASE }}
        />
      </View>

      <View
        className="h-[22px] w-[22px] rounded-full"
        style={{ backgroundColor: SKELETON_BASE }}
      />
    </Card>
  );
}
