// 🔹 auth.controller.ts
// 사용자 인증 API 요청을 처리하는 컨트롤러

import { Request, Response } from 'express';
import { signupUser, loginUser, getUserInfo } from '../services/auth.service';

/**
 * 회원가입 요청 처리
 */
export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body; // 요청 데이터 추출
  const user = await signupUser(email, password, name); // 서비스 호출
  res.status(201).json({ id: user.id, email: user.email, name: user.name });
};

/**
 * 로그인 요청 처리
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body; // 요청 데이터 추출
  const { token } = await loginUser(email, password); // 서비스 호출
  res.json({ token });
};

/**
 * 현재 로그인한 사용자 정보 조회 처리
 */
export const me = async (req: Request, res: Response) => {
  const userId = req.user.id; // JWT에서 추출된 사용자 ID
  const userInfo = await getUserInfo(userId); // 서비스 호출
  res.json(userInfo);
};
