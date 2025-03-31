// 🔹 auth.service.ts
// 이 파일은 인증 로직을 처리하는 서비스 계층입니다.

import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../utils/jwt.util";

import prisma from "../config/prisma.service";

/**
 * 회원가입 요청 처리 (DB 저장)
 */
export const register = async (data: { email: string; password: string; name?: string }) => {
    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });
  
    if (exists) {
      return { message: "이미 등록된 이메일입니다." };
    }
  
    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: data.email,
        password: data.password,
        name: data.name ?? "",
        gender: "",
        age: 0,
        height: 0,
        weight: 0,
        medications: [],
      },
    });
  
    return newUser;
  };

/**
 * 로그인 요청 처리 (DB 조회 → 토큰 발급)
 */
export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user || user.password !== password) return null;
  
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  };