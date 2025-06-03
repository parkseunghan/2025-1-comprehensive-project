// 📄 components/common/LogoutButton.tsx

import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function LogoutButton() {
    const { logout } = useAuthStore(); // ✅ Zustand 상태 초기화 함수
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // 🔹 1. 저장된 로컬 토큰 및 기타 정보제
            await AsyncStorage.multiRemove(["token", "latestRecordId"]);
            // 🔹 2. 상태 초기화 (Zustand)
            logout();
            // 🔹 3. welcome(시작 화면)으로 이동
            router.replace("/(auth)/welcome");
        } catch (err) {
            console.error("❌ 로그아웃 오류:", err);
            Alert.alert("로그아웃 실패", "다시 시도해주세요.");
        }
    };

    return (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: "#D92B4B", // 로그인 버튼과 동일한 빨간 배경
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    logoutButtonText: {
        color: "#ffffff", // 흰색 텍스트
        fontSize: 16,
        fontWeight: "bold",
    },
});
