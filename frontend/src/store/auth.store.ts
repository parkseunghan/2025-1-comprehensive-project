// store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/user";

type AuthStore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage), // ✅ 핵심 수정
        }
    )
);
