import { View } from 'react-native';

export function TerrainArt() {
  return (
    <View className="absolute inset-0">
      <View
        className="absolute w-[120px] rounded-[120px]"
        style={{
          backgroundColor: '#d8c39a',
          height: 320,
          left: 102,
          top: -34,
          transform: [{ rotate: '18deg' }],
        }}
      />
      <View
        className="absolute rounded-[120px]"
        style={{
          backgroundColor: '#efe0bf',
          height: 250,
          left: 146,
          top: -20,
          transform: [{ rotate: '18deg' }],
          width: 40,
        }}
      />
      <View
        className="absolute rounded-[80px]"
        style={{ backgroundColor: '#314234', height: 140, left: -8, top: 16, width: 110 }}
      />
      <View
        className="absolute rounded-[80px]"
        style={{ backgroundColor: '#314234', height: 96, right: 14, top: 26, width: 70 }}
      />
      <View
        className="absolute rounded-[80px]"
        style={{ backgroundColor: '#314234', height: 120, right: 10, top: 120, width: 110 }}
      />
      <View
        className="absolute rounded-[120px] border"
        style={{
          borderColor: 'rgba(217,198,155,0.34)',
          height: 160,
          left: -16,
          top: 8,
          width: 120,
        }}
      />
      <View
        className="absolute rounded-[120px] border"
        style={{
          borderColor: 'rgba(217,198,155,0.34)',
          height: 86,
          left: 18,
          top: 74,
          width: 86,
        }}
      />
      <View
        className="absolute rounded-[120px] border"
        style={{
          borderColor: 'rgba(217,198,155,0.34)',
          height: 130,
          right: 2,
          top: 102,
          width: 122,
        }}
      />
    </View>
  );
}
