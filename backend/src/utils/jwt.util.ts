// 🔹 jwt.util.ts
// JWT 생성 및 검증 헬퍼 함수 모듈

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * 사용자 정보(payload)를 받아 JWT 토큰을 생성합니다.
 * @param payload 토큰에 저장할 사용자 정보 객체
 */
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // 7일간 유효
};

/**
 * 전달받은 JWT 토큰을 검증합니다.
 * @param token 검증할 JWT 토큰
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
