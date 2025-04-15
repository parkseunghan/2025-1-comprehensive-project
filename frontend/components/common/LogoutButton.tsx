// 📄 components/common/LogoutButton.tsx
// 로그아웃 버튼 컴포넌트입니다. 토큰을 삭제하고 상태를 초기화한 후 welcome 화면으로 이동합니다.

import { Alert, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function LogoutButton() {
  const { logout } = useAuthStore(); // ✅ Zustand 상태 초기화 함수
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 🔹 1. 저장된 로컬 토큰 및 기타 정보 삭제
      await AsyncStorage.multiRemove(["token", "latestRecordId"]);

      // 🔹 2. 상태 초기화 (Zustand)
      logout();

      // 🔹 3. welcome(시작 화면)으로 이동
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("❌ 로그아웃 오류:", err);
      Alert.alert("로그아웃 실패", "다시 시도해주세요.");
    }
  };

  return <Button title="로그아웃" onPress={handleLogout} color="#EF4444" />;
}
