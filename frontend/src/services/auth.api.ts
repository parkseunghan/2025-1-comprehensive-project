// 📄 src/services/auth.api.ts
import axios from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

/** 🔐 로그인 */
export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>('/auth/login', credentials);
  return data;
};

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

/** 📝 회원가입 */
export const signupUser = async (
  payload: RegisterRequest
): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>('/auth/signup', payload);
  return data;
};

/** 👤 현재 로그인된 사용자 조회 */
export const fetchCurrentUser = async (): Promise<{
  id: string;
  email: string;
  name: string;
}> => {
  const { data } = await axios.get('/auth/me');
  return data;
};
