// 📄 app/(auth)/login.tsx
// 로그인 UI + 상태 연동
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const { handleLogin, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    if (!email || !password) {
      Alert.alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    handleLogin({ email, password });
  };

  return (
    <View style={styles.container}>
      {/* 🔹 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerText}>이메일 로그인</Text>
      </View>

      {/* 🔹 입력 필드 */}
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

      {/* 🔹 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={onSubmit} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>로그인</Text>
        )}
      </TouchableOpacity>

      {/* 🔹 에러 메시지 */}
      {error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>{error}</Text>}

      {/* 🔹 하단 링크 */}
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
  loginButton: {
    backgroundColor: '#D92B4B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
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
  footerDivider: {
    marginHorizontal: 12,
    color: '#D1D5DB',
  },
});
