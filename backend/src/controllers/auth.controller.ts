// 📄 controllers/auth.controller.ts
// 인증 관련 API 컨트롤러 (회원가입, 로그인, 사용자 조회, 비밀번호 변경)

import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { generateToken } from "../utils/jwt.util";
import { AuthRequest } from "../../types/express";

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

  const token = generateToken(result);

  res.status(201).json({
    token,
    user: {
      id: result.id,
      email: result.email,
      name: result.name,
      gender: "",
    },
  });
};

/**
 * 🔹 로그인
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("💬 로그인 요청:", email);

  const result = await authService.login(email, password);

  if (!result) {
    res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  res.json(result);
};

/**
 * 🔹 내 정보 조회
 */
export const getMe = async (req: AuthRequest, res: Response) => {
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

/**
 * 🔹 비밀번호 변경
 */
type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (
  req: AuthRequest<ChangePasswordBody>,
  res: Response
) => {
  console.log("🔐 비밀번호 변경 요청 도착");
  console.log("✅ 사용자:", req.user);
  console.log("📦 req.body:", req.body);

  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    res.status(401).json({ message: "인증 정보가 없습니다." });
    return;
  }

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요." });
    return;
  }

  const result = await authService.changePassword(userId, currentPassword, newPassword);

  if (!result.success) {
    res.status(result.status || 400).json({ message: result.message });
    return;
  }

  res.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
};
