// 📄 src/utils/jwt.util.ts
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ✅ 명확한 예외 처리
if (!JWT_SECRET) {
    throw new Error("❌ 환경 변수 'JWT_SECRET'이 설정되지 않았습니다.");
}

/**
 * JWT 토큰 생성
 * @param payload - 토큰에 저장할 사용자 정보 객체
 * @param expiresIn - 만료 기간 (기본: 7일)
 */
export const generateToken = (
    payload: object,
    expiresIn: string = JWT_EXPIRES_IN
): string => {
    const options: SignOptions = { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] };
    return jwt.sign(payload, JWT_SECRET as Secret, options);
};

/**
 * JWT 토큰 검증
 * @param token - 검증할 토큰
 * @returns payload 또는 null
 */
export const verifyToken = (token: string): Record<string, any> | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as Record<string, any>;
    } catch (err) {
        console.error("❌ JWT 검증 실패:", err);
        return null;
    }
};
