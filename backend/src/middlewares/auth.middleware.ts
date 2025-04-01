// 🔹 auth.middleware.ts
// JWT 토큰을 검증하는 인증 미들웨어

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

/**
 * JWT 인증 미들웨어로, 사용자 요청 시 토큰 유효성을 검증합니다.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer 토큰 추출

    if (!token) {
        res.status(401).json({ message: '토큰이 없습니다.' });
        return;
    }

    try {
        const decoded = verifyToken(token); // <- 여기가 중요! // JWT 검증
        console.log("Decoded JWT Payload:", decoded);

        // ✅ 토큰 구조 검증: id, email 필수
        if (!decoded || typeof decoded !== "object" || !("id" in decoded) || !("email" in decoded)) {
            res.status(401).json({ message: "유효하지 않은 토큰입니다." });
            return;
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
        };                 // 요청 객체에 사용자 정보 추가
        next();                             // 다음 미들웨어로 이동
    } catch (error) {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        return;
    }
};
