// 📄 src/hooks/useAuth.ts
// ✅ 사용자 인증 흐름을 관리하는 커스텀 훅입니다.
// - 수동 로그인 (POST /auth/login)
// - 자동 로그인 (AsyncStorage → 사용자 정보 fetch)
// - 로그인 실패 시 상태 초기화 및 에러 메시지 제공

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { loginUser, fetchCurrentUser, LoginRequest } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";

export const useAuth = () => {
    const { setAuth, logout } = useAuthStore(); // ✅ 상태 업데이트 및 로그아웃 함수
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false); // 🔄 로딩 중 여부
    const [error, setError] = useState<string | null>(null); // ⚠️ 에러 메시지

    /**
     * 🔐 로그인 요청 처리 함수
     * @param credentials 로그인 요청 객체 (email, password)
     * @returns boolean - 성공 여부
     */
    const handleLogin = async (credentials: LoginRequest): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const { token, user } = await loginUser(credentials); // API 호출
            await AsyncStorage.setItem("token", token);           // 로컬 저장
            console.log("🧾 로그인 응답 user:", user); // 👈 gender 확인
            setAuth(token, user);                                 // Zustand 상태 저장
            return true;
        } catch (err) {
            console.error("❌ 로그인 실패:", err);
            setError("이메일 또는 비밀번호가 잘못되었습니다.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 🔄 앱 시작 시 토큰 기반 자동 로그인
     */
    const loadUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const user = await fetchCurrentUser(); // 토큰이 있으면 사용자 정보 요청
            setAuth(token, user);
            console.log("✅ 자동 로그인 성공:", user);
        } catch (err) {
            console.warn("⚠️ 자동 로그인 실패:", err);
            logout(); // 유효하지 않은 토큰 → 로그아웃 처리
        }
    };

    // 앱 첫 실행 시 자동 로그인 시도
    useEffect(() => {
        loadUser();
    }, []);

    return {
        handleLogin,
        loadUser,
        isLoading,
        error,
    };
};
