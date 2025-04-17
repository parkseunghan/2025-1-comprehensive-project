// 📄 services/auth.service.ts
// 인증 로직 처리 (회원가입, 로그인, 사용자 조회)

import { generateToken } from "../utils/jwt.util";
import prisma from "../config/prisma.service";

/**
 * 🔹 회원가입
 */
export const signup = async (data: {
  email: string;
  password: string;
  name?: string;
}): Promise<
  | { id: string; email: string; name?: string }
  | { message: string }
> => {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });

  if (exists) {
    return { message: "이미 등록된 이메일입니다." };
  }

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name ?? "",
      gender: "",
      age: 0,
      height: 0,
      weight: 0,
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name ?? undefined,
  };
};

/**
 * 🔹 로그인
 */
export const login = async (
  email: string,
  password: string
): Promise<
  null | {
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
      gender: string; // ✅ 포함
    };
  }
> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      password: true,
    },
  });

  if (!user || user.password !== password) return null;

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name ?? "",
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      gender: user.gender,
    },
  };
};

/**
 * 🔹 사용자 조회 (GET /auth/me)
 */
export const getUserById = async (
  id: string
): Promise<{
  id: string;
  email: string;
  name?: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  medications?: string[];
  diseases?: string[];
  createdAt: Date;
  updatedAt: Date;
} | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  const { password, ...safeUser } = user;
  return {
    ...safeUser,
    name: user.name ?? undefined,
  };
};
