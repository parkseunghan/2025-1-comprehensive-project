/**
 * profile-form.tsx
 * 이 화면은 회원가입 이후 최초 로그인한 사용자가
 * 성별, 나이, 키, 몸무게 등의 프로필 정보를 작성하고 저장하는 역할을 합니다.
 * 
 * UI는 생략하고, 저장 API 연동 로직만 포함되어 있습니다.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { updateUserProfile } from "@/services/user.api";
import { useRouter } from "expo-router";

export default function ProfileFormScreen() {
    const { user, setUser } = useAuthStore();
    const router = useRouter();

    /**
     * 🔹 handleSave
     * 로그인한 사용자의 ID를 이용해 프로필 정보를 업데이트합니다.
     * 저장 성공 시 전역 상태(auth.store)에 반영하고 홈 탭으로 이동합니다.
     */
    const handleSave = async () => {
        if (!user) return;

        // ✅ 임시 더미 데이터: UI 완성 후 대체 가능
        const updated = await updateUserProfile(user.id, {
            gender: "남성",
            age: 28,
            height: 175,
            weight: 68,
            medications: ["타이레놀", "지속복용약"],
        });

        // ✅ 상태 갱신
        setUser(updated);

        // ✅ 홈으로 이동
        router.replace("/(tabs)home");
    };

    // 컴포넌트 마운트 시 자동 실행
    useEffect(() => {
        handleSave();
    }, []);

    return null; // UI는 이후 프론트엔드 엔지니어가 작성 예정
}
