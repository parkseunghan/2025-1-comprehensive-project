/**
 * setting.tsx
 * 이 화면은 로그아웃, 프로필 정보 보기/수정, 앱 설정 등을 포함할 수 있습니다.
 * 지금은 로그아웃 기능만 제공합니다.
 */

import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "expo-router";

export default function SettingTabScreen() {
  const { clearUser } = useAuthStore();
  const router = useRouter();

  /**
   * 로그아웃 처리
   * - 토큰 삭제
   * - 상태 초기화
   * - welcome 화면으로 이동
   */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    clearUser();
    router.replace("/auth/welcome");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
      <Text style={{ fontSize: 18 }}>⚙️ 설정</Text>
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
}
