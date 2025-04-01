import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchMe } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";

export const useAuth = () => {
    const { setUser } = useAuthStore();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) return;

                const user = await fetchMe();
                setUser(user);
                console.log("useAuth.ts: ✅ 로그인 사용자 정보:", user);
            } catch (err) {
                console.log("useAuth.ts: ❌ 사용자 정보 로드 실패:", err);
            }
        };

        loadUser();
    }, []);
};
