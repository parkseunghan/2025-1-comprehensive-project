import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { signupUser  } from '@/services/auth.api';
import { useAuthStore } from '@/store/auth.store';

export default function SignupScreen() {
    const setAuth = useAuthStore((state) => state.setAuth);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailCheckResult, setEmailCheckResult] = useState<null | boolean>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkEmailDuplicate = () => {
        if (!email.trim()) return;
        // TODO: 실제 API 연결 예정
        setEmailCheckResult(email !== 'test@example.com');
    };

    const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const handleSignup = async () => {
        if (!email || !password || !name) {
            Alert.alert('필수 정보를 입력해주세요.');
            return;
        }
        if (isPasswordMismatch) {
            Alert.alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            setIsLoading(true);
            const res = await signupUser ({ email, password, name });

            if (res.message) {
                Alert.alert(res.message);
                return;
            }
            // 회원가입 성공 → 상태 저장 + 토큰 저장
            await AsyncStorage.setItem('token', res.token);
            setAuth(res.token, res.user);

            // 프로필 작성 화면으로 이동
            router.replace('/(auth)/profile-form');
        } catch (err) {
            console.error('회원가입 오류:', err);
            Alert.alert('회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerText}>회원가입</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="이름"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
            />

            <View style={styles.emailRow}>
                <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="이메일"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setEmailCheckResult(null);
                    }}
                />
                <TouchableOpacity style={styles.checkButton} onPress={checkEmailDuplicate}>
                    <Text style={styles.checkButtonText}>중복 확인</Text>
                </TouchableOpacity>
            </View>

            {emailCheckResult !== null ? (
                <Text
                    style={[
                        styles.resultMessage,
                        { color: emailCheckResult ? '#10B981' : '#EF4444' },
                    ]}
                >
                    {emailCheckResult
                        ? '가입 가능한 이메일입니다'
                        : '이미 존재하는 이메일입니다'}
                </Text>
            ) : (
                <View style={{ height: 24 }} />
            )}

            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호 확인"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {isPasswordMismatch ? (
                <Text style={styles.errorText}>비밀번호가 일치하지 않습니다</Text>
            ) : (
                <View style={{ height: 24 }} />
            )}

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

            <View style={styles.footer}>
                <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={[styles.footerText, { fontWeight: 'bold', marginLeft: 6 }]}>로그인</Text>
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
    backButton: {
        marginRight: 8,
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

