"use strict";
// 🔹 auth.middleware.ts
// JWT 토큰을 검증하는 인증 미들웨어
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_util_1 = require("../utils/jwt.util");
/**
 * JWT 인증 미들웨어로, 사용자 요청 시 토큰 유효성을 검증합니다.
 */
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Bearer 토큰 추출
    if (!token) {
        res.status(401).json({ message: '토큰이 없습니다.' });
        return;
    }
    try {
        const decoded = (0, jwt_util_1.verifyToken)(token); // JWT 검증
        // ✅ 토큰 구조 검증: id, email 필수
        if (!decoded || typeof decoded !== "object" || !("id" in decoded) || !("email" in decoded)) {
            res.status(401).json({ message: "유효하지 않은 토큰입니다." });
            return;
        }
        req.user = decoded; // 요청 객체에 사용자 정보 추가
        return next(); // 다음 미들웨어로 이동
    }
    catch (error) {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
