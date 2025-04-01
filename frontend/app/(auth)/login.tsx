// login.tsx
// 로그인 API 호출 + 토큰 저장 처리 (UI 없음, 추후 대체 예정)

import { useEffect } from "react";
import { login } from "@/services/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  useEffect(() => {
    const handleLogin = async () => {
      const res = await login("test@example.com", "1234");
      await AsyncStorage.setItem("token", res.token);
      console.log("✅ 로그인 성공:", res.user);
    };

    handleLogin();
  }, []);

  return null; // UI는 나중에 교체될 예정
}
