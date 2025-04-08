// 📄 src/hooks/useAuth.ts
// 사용자 인증 흐름을 통합 관리하는 커스텀 훅
// - 자동 로그인 (AsyncStorage 토큰 → 사용자 정보 fetch)
// - 수동 로그인 요청 (POST /auth/login)

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { fetchCurrentUser, loginUser, LoginRequest } from '@/services/auth.api';
import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
  const { setAuth, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);     // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const router = useRouter();

  /**
   * 로그인 요청 핸들러
   * @param credentials email + password
   */
  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user } = await loginUser(credentials);
      await AsyncStorage.setItem('token', token); // 로컬 저장
      setAuth(token, user);                       // 상태 저장
      router.replace('/(tabs)/home');             // 홈 이동
    } catch (err) {
      console.error('❌ 로그인 실패:', err);
      setError('이메일 또는 비밀번호가 잘못되었습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 앱 최초 실행 시 토큰 기반 자동 로그인
   */
  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const user = await fetchCurrentUser();
      setAuth(token, user);
      console.log('✅ 로그인 사용자 정보:', user);
    } catch (err) {
      console.log('❌ 사용자 정보 로드 실패:', err);
      logout(); // 토큰 무효 시 초기화
    }
  };

  useEffect(() => {
    loadUser(); // 앱 시작 시 자동 실행
  }, []);

  return {
    handleLogin,
    loadUser,
    isLoading,
    error,
  };
};
