import { useEffect, useState } from "react";
import { router, useRootNavigationState } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const rootNavigation = useRootNavigationState();
  const { user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const { loadUser } = useAuth(); // 자동 로그인 함수만 실행

  useEffect(() => {
    if (!rootNavigation?.key) return;

    const initialize = async () => {
      console.log("🟡 Root ready → 자동 로그인 시도");
      await loadUser(); // ✅ user 상태가 설정될 때까지 기다림
      setIsReady(true);
    };

    initialize();
  }, [rootNavigation?.key]);

  useEffect(() => {
    if (!isReady) return;

    console.log("✅ user 상태:", user);

    if (!user) {
      router.replace("/(auth)/welcome");
    } else if (!user.gender) {
      router.replace("/(auth)/profile-form");
    } else {
      router.replace("/(tabs)/home");
    }
  }, [isReady, user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#D92B4B" />
    </View>
  );
}
