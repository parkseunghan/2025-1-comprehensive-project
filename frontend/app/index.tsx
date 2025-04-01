// index.tsx
// 앱 시작 시 사용자 상태에 따라 적절한 화면으로 리디렉션합니다.

import { useRouter, useRootNavigationState  } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
    const router = useRouter();
    const rootNavigation = useRootNavigationState();
    const { user } = useAuthStore();

    useAuth(); // ✅ 토큰 기반 /auth/me 자동 호출

    useEffect(() => {
        // ✅ Root 라우터가 아직 준비되지 않았으면 아무것도 안 함
        if (!rootNavigation?.key) return;
        if (user === null) return; // 아직 로딩 중

        if (!user) {
            router.replace("/auth/welcome");
        } else if (!user.gender) {
            router.replace("/auth/profile-form");
        } else {
            router.replace("/tabs/home");
        }
    }, [user]);

    return null; // UI 없음 (자동 리디렉션 전용)
}
