// 📁 src/store/auth.store.ts
// ✅ 사용자 인증 상태(Zustand + AsyncStorage) 관리 스토어입니다.
// - 로그인 시 토큰과 사용자 정보 저장
// - 로그아웃 시 상태 초기화
// - 로그인 여부 및 관리자 여부를 상태 기반으로 제공
// - 상태는 AsyncStorage를 통해 자동 영속 저장됩니다.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/user.types";

// 🔹 Zustand 스토어 타입 정의
type AuthStore = {
    token: string | null;   // JWT 액세스 토큰
    user: User | null;      // 로그인된 사용자 정보

    isLoggedIn: boolean;    // 로그인 여부
    isAdmin: boolean;       // 관리자 여부

    setAuth: (token: string, user: User) => void; // 로그인 상태 저장
    logout: () => void;                           // 로그아웃 → 상태 초기화
};

// ✅ 인증 스토어 구현 (Zustand + AsyncStorage)
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isLoggedIn: false,
            isAdmin: false,

            // 🔸 로그인 시 상태 저장
            setAuth: (token, user) => {
                set({
                    token,
                    user,
                    isLoggedIn: true,
                    isAdmin: user.role === "admin",
                });
            },

            // 🔸 로그아웃 시 상태 초기화
            logout: () => {
                set({
                    token: null,
                    user: null,
                    isLoggedIn: false,
                    isAdmin: false,
                });
            },
        }),
        {
            name: "auth-storage", // AsyncStorage 키 이름
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
