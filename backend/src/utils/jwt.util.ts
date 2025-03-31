// 🔹 jwt.util.ts
// JWT 생성 및 검증 헬퍼 함수 모듈

import jwt, { Secret, SignOptions } from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * 사용자 정보(payload)를 받아 JWT 토큰을 생성합니다.
 * @param payload 토큰에 저장할 사용자 정보 객체
 * @param expiresIn 만료 기간 (기본값: .env의 JWT_EXPIRES_IN 또는 7d)
 */
export const generateToken = (
    payload: object,
    expiresIn: string = JWT_EXPIRES_IN
): string => {
    const options: SignOptions = { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] };
    return jwt.sign(payload, JWT_SECRET as Secret, options);
};

/**
 * 전달받은 JWT 토큰을 검증합니다.
 * @param token 검증할 JWT 토큰
 */
export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("❌ JWT 검증 실패:", err);
        return null;
    }
};
