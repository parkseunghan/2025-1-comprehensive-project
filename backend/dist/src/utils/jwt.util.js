"use strict";
// 🔹 jwt.util.ts
// JWT 생성 및 검증 헬퍼 함수 모듈
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
/**
 * 사용자 정보(payload)를 받아 JWT 토큰을 생성합니다.
 * @param payload 토큰에 저장할 사용자 정보 객체
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // 7일간 유효
};
exports.generateToken = generateToken;
/**
 * 전달받은 JWT 토큰을 검증합니다.
 * @param token 검증할 JWT 토큰
 */
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
