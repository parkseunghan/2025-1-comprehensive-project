/**
 * home.tsx
 * 이 파일은 홈 탭의 루트 컴포넌트로, 로그인된 사용자 정보를 불러와
 * 간단한 인사말 또는 요약 정보를 표시합니다.
 * 추후 'e약은요' API 결과를 이 화면에 통합할 수 있습니다.
 */

import { Text, View } from "react-native";
import { useAuthStore } from "@/store/auth.store";

export default function HomeTabScreen() {
  // 🔹 현재 로그인된 사용자 정보 가져오기 (전역 상태)
  const { user } = useAuthStore();

  /**
   * 이곳은 추후 '복용중인 약물' 정보에 따라
   * 'e약은요' 공공 API로부터 약품 정보를 불러오는 영역이 될 수 있습니다.
   * 예: /drugs?name=지속복용약 → 결과 표시
   */

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 간단한 사용자 환영 문구 출력 */}
      <Text style={{ fontSize: 20 }}>
        안녕하세요, {user?.name ?? "사용자"}님 👋
      </Text>

      {/* 추후 여기에 '복용중인 약물 목록 + 약 설명 보기' 기능 추가 예정 */}
    </View>
  );
}
