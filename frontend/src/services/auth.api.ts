// 📄 src/services/auth.api.ts
// 인증 관련 API 요청 코드 (로그인, 회원가입, 사용자 정보 조회 포함)

import axios from './axios';

/** ✅ 로그인 요청 타입 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** ✅ 로그인 응답 타입 */
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

/** 🔐 로그인 요청 */
export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>('/auth/login', credentials);
  return data;
};

/** ✅ 회원가입 요청 타입 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/** 📝 회원가입 요청 */
export const signupUser  = async (
  payload: RegisterRequest
): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>('/auth/signup', payload);
  return data;
};

/** 👤 로그인된 사용자 정보 조회 (JWT 필요) */
export const fetchCurrentUser = async (): Promise<{
  id: string;
  email: string;
  name: string;
}> => {
  const { data } = await axios.get('/auth/me');
  return data;
};
