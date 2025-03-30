// 🔹 auth.service.ts
// 사용자 인증 비즈니스 로직 서비스

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';

const prisma = new PrismaClient();

/**
 * 신규 사용자를 회원가입 처리합니다.
 */
export const signupUser = async (email: string, password: string, name?: string) => {
  const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱
  return prisma.user.create({
    data: { email, password: hashedPassword, name },
  });
};

/**
 * 사용자를 로그인 처리 후 JWT 토큰을 발급합니다.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } }); // 이메일로 사용자 찾기
  if (!user) throw new Error('존재하지 않는 사용자입니다.');

  const validPassword = await bcrypt.compare(password, user.password); // 비밀번호 비교
  if (!validPassword) throw new Error('비밀번호가 일치하지 않습니다.');

  const token = generateToken({ id: user.id, email: user.email }); // JWT 토큰 생성
  return { token };
};

/**
 * 사용자 ID로 사용자 정보를 조회합니다.
 */
export const getUserInfo = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } }); // 사용자 조회
  if (!user) throw new Error('사용자를 찾을 수 없습니다.');

  const { password, ...userInfo } = user; // 비밀번호 제거 후 반환
  return userInfo;
};
