"use strict";
// 🔹 jwt.util.ts
// JWT 생성 및 검증 헬퍼 함수 모듈
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
/**
 * 사용자 정보(payload)를 받아 JWT 토큰을 생성합니다.
 * @param payload 토큰에 저장할 사용자 정보 객체
 * @param expiresIn 만료 기간 (기본값: .env의 JWT_EXPIRES_IN 또는 7d)
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
    const options = { expiresIn: expiresIn };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
/**
 * 전달받은 JWT 토큰을 검증합니다.
 * @param token 검증할 JWT 토큰
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (err) {
        return null;
    }
};
exports.verifyToken = verifyToken;
