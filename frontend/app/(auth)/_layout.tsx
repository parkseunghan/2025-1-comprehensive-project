// 📄 app/(auth)/_layout.tsx

import { useEffect } from "react";
import { Slot, usePathname, useRootNavigationState, router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function AuthLayout() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const nav = useRootNavigationState();

  useEffect(() => {
    if (!nav?.key) return;

    // ✅ 로그인 되어 있음
    if (user) {
      if (user.gender) {
        if (pathname !== "/(tabs)/home") {
          console.log("✅ 로그인 + 프로필 있음 → 홈 이동");
          router.replace("/(tabs)/home");
        }
      } else {
        if (pathname !== "/(user)/profile-form") {
          console.log("✅ 로그인 + 프로필 없음 → 프로필 입력 이동");
          router.replace("/(user)/profile-form");
        }
      }
    }
  }, [user?.id, user?.gender, pathname, nav?.key]);

  return <Slot />;
}
