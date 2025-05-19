// 📄 types/express/index.d.ts
// Express Request 타입 확장 (JWT 인증 이후 req.user 사용을 위함)

import { Request } from "express";
import { JwtPayload } from "../../utils/jwt.util";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload; // ✅ 전역 확장: optional
        }
    }
}

// ✅ 명시적으로 "로그인된 요청"만을 위한 타입
export interface AuthRequest<T = any> extends Request {
    body: T;
    user?: JwtPayload;
}