import { Slot, useRouter, useRootNavigationState } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export default function HomeLayout() {
    const { user } = useAuthStore();
    const router = useRouter();
    const nav = useRootNavigationState();

    useEffect(() => {
        if (!nav?.key) return;
        if (!user) {
            console.log("🚫 [home] 인증 안됨 → welcome 이동");
            router.replace("/(auth)/welcome");
        }
    }, [user, nav?.key]);

    return <Slot />;
}
