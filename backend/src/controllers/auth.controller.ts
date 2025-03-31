// 🔹 auth.controller.ts
// 이 파일은 인증(Authentication) 관련 요청을 처리하는 컨트롤러입니다.
// 더미 사용자 데이터를 기반으로 로그인 및 회원가입 처리를 시뮬레이션합니다.

import { Request, Response } from "express";
import * as authService from "../services/auth.service";

/**
 * 사용자 회원가입 요청 처리
 * POST /auth/register
 */
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const result = await authService.register({ email, password, name });
  res.status(201).json(result);
};

/**
 * 사용자 로그인 요청 처리
 * POST /auth/login
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  if (!result) {
    res.status(401).json({ message: "Invalid credentials" });
  } else {
    res.json(result);
  }
};
