// 📄 controllers/auth.controller.ts
// 인증 관련 API 컨트롤러 (회원가입, 로그인, 사용자 조회)

import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { generateToken } from "../utils/jwt.util";

/**
 * 🔹 회원가입
 */
export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const result = await authService.signup({ email, password, name });

  if ("message" in result) {
    res.status(400).json({ message: result.message });
    return;
  }

  const token = generateToken({
    id: result.id,
    email: result.email,
    name: result.name ?? "",
  });

  res.status(201).json({
    token,
    user: {
      id: result.id,
      email: result.email,
      name: result.name,
      gender: "", // ✅ 회원가입 직후는 빈 값으로 처리 가능
    },
  });
};

/**
 * 🔹 로그인
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  if (!result) {
    res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  res.json(result); // ✅ result.user.gender 포함됨
};

/**
 * 🔹 로그인된 사용자 정보 조회
 */
export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "인증 정보가 없습니다." });
    return;
  }

  const user = await authService.getUserById(userId);

  if (!user) {
    res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    return;
  }

  res.json(user);
};
