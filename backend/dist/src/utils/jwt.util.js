"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
// 📄 src/utils/jwt.util.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../../.env") });
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
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
    const options = { expiresIn: expiresIn };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
/**
 * JWT 토큰 검증
 * @param token - 검증할 토큰
 * @returns payload 또는 null
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (err) {
        console.error("❌ JWT 검증 실패:", err);
        return null;
    }
};
exports.verifyToken = verifyToken;
