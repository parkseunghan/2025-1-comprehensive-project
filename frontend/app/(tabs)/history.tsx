/**
 * history.tsx
 * 이 화면은 사용자가 이전에 입력한 증상 기록과 진단 결과 목록을 확인하는 페이지입니다.
 * 현재는 더미 텍스트만 표시하며, 추후 API 연동 예정입니다.
 */

import { View, Text } from "react-native";

export default function HistoryTabScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 16 }}>🩺 진단 기록이 여기에 표시됩니다.</Text>
    </View>
  );
}
