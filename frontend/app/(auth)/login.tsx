// 📄 app/(auth)/login.tsx
// 로그인 UI + 인증 상태 연동

import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import BackButton from "@/common/BackButton";

export default function LoginScreen() {
    const { handleLogin, isLoading, error } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("입력 오류", "이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }

        const success = await handleLogin({ email, password });

        if (success) {
            Alert.alert("✅ 로그인 성공", "홈 화면으로 이동합니다.");
            router.replace("/(tabs)/home");
        }
    };

    return (
        <View style={styles.container}>
            {/* 🔙 상단 헤더 */}
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerText}>이메일 로그인</Text>
            </View>

            {/* 🔐 입력 필드 */}
            <TextInput
                style={styles.input}
                placeholder="이메일"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* 🔘 로그인 버튼 */}
            <TouchableOpacity
                style={styles.loginButton}
                onPress={onSubmit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.loginButtonText}>로그인</Text>
                )}
            </TouchableOpacity>

            {/* ⚠️ 에러 메시지 */}
            {error && (
                <Text style={styles.errorText}>
                    {typeof error === "string"
                        ? error
                        : "로그인에 실패했습니다. 다시 시도해주세요."}
                </Text>
            )}

            {/* 🔗 하단 링크 */}
            <View style={styles.footer}>
                <TouchableOpacity>
                    <Text style={styles.footerText}>아이디 찾기</Text>
                </TouchableOpacity>
                <Text style={styles.footerDivider}> | </Text>
                <TouchableOpacity>
                    <Text style={styles.footerText}>비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingTop: 80,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        fontSize: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: "#D92B4B",
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 24,
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 16,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        color: "#111827",
        fontSize: 14,
    },
    footerDivider: {
        marginHorizontal: 12,
        color: "#D1D5DB",
    },
});
