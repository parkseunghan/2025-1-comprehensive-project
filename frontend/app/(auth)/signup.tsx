// 📄 app/(auth)/signup.tsx
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
import { ZodError } from "zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signupUser } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { signupSchema, SignupForm } from "@/schemas/auth.schema";
import BackButton from "@/common/BackButton";

export default function SignupScreen() {
    const setAuth = useAuthStore((state) => state.setAuth);

    const [form, setForm] = useState<SignupForm>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [emailCheckResult, setEmailCheckResult] = useState<null | boolean>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false); // ✅ 추가

    const handleChange = (key: keyof SignupForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (key === "email") setEmailCheckResult(null);
    };

    const checkEmailDuplicate = () => {
        if (!form.email.trim()) return;
        setEmailCheckResult(form.email !== "test@example.com"); // TODO: 실제 중복 확인 API로 교체
    };

    const handleSignup = async () => {
        if (!agreeToTerms) {
            Alert.alert("개인정보 수집 동의가 필요합니다.");
            return;
        }

        try {
            const parsed = signupSchema.parse(form);
            setIsLoading(true);
            const res = await signupUser({
                email: parsed.email,
                password: parsed.password,
                name: parsed.name,
            });

            if (res.message) {
                Alert.alert(res.message);
                return;
            }

            await AsyncStorage.setItem("token", res.token);
            setAuth(res.token, res.user);

            router.replace("/(user)/profile-form");
        } catch (err: any) {
            if (err instanceof ZodError) {
                Alert.alert("입력 오류", err.issues?.[0]?.message || "입력값이 올바르지 않습니다.");
            } else {
                console.error("❌ 회원가입 오류:", err);
                Alert.alert("회원가입에 실패했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isPasswordMismatch =
        form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

    return (
        <View style={styles.container}>
            {/* 🔙 상단 헤더 */}
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerText}>회원가입</Text>
            </View>

            {/* 📝 입력 필드 */}
            <TextInput
                style={styles.input}
                placeholder="이름"
                placeholderTextColor="#9CA3AF"
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
            />

            <View style={styles.emailRow}>
                <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="이메일"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(v) => handleChange("email", v)}
                />
                <TouchableOpacity style={styles.checkButton} onPress={checkEmailDuplicate}>
                    <Text style={styles.checkButtonText}>중복 확인</Text>
                </TouchableOpacity>
            </View>

            {emailCheckResult !== null ? (
                <Text
                    style={[
                        styles.resultMessage,
                        { color: emailCheckResult ? "#10B981" : "#EF4444" },
                    ]}
                >
                    {emailCheckResult
                        ? "가입 가능한 이메일입니다"
                        : "이미 존재하는 이메일입니다"}
                </Text>
            ) : (
                <View style={{ height: 24 }} />
            )}

            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호 확인"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
            />

            {isPasswordMismatch ? (
                <Text style={styles.errorText}>비밀번호가 일치하지 않습니다</Text>
            ) : (
                <View style={{ height: 24 }} />
            )}

            {/* ✅ 개인정보 수집 동의 체크박스 */}
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreeToTerms((prev) => !prev)}
            >
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>개인정보 수집 및 이용에 동의합니다</Text>
            </TouchableOpacity>

            {/* 🔘 회원가입 버튼 */}
            <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.signupButtonText}>회원가입</Text>
                )}
            </TouchableOpacity>

            {/* 🔚 하단 */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                    <Text style={[styles.footerText, { fontWeight: "bold", marginLeft: 6 }]}>
                        로그인
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 80,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        fontSize: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkButton: {
        backgroundColor: '#D92B4B',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginLeft: 8,
    },
    checkButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    resultMessage: {
        fontSize: 14,
        marginBottom: 24,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginBottom: 24,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 4,
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: '#D92B4B',
        borderColor: '#D92B4B',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#111827',
    },
    signupButton: {
        backgroundColor: '#D92B4B',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    signupButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#111827',
        fontSize: 14,
    },
});
