// 🔹 auth.middleware.ts
// JWT 토큰을 검증하는 인증 미들웨어

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "토큰이 없습니다." });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id || !decoded.email) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    return;
  }

  req.user = {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    gender: decoded.gender,
  };

  next();
};
