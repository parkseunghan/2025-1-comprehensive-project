// 🔹 auth.routes.ts
// 이 파일은 사용자 인증(Authentication) 관련 라우터를 정의합니다.
// 회원가입 및 로그인 요청을 처리합니다.

import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// [POST] /auth/register - 회원가입
router.post("/signup", authController.signup);

// [POST] /auth/login - 로그인
router.post("/login", authController.login);

// [GET] /auth/me - 로그인된 사용자 정보 조회
router.get("/me", authMiddleware, authController.getMe);

// [PUT] /auth/change-password - 비밀번호 변경
router.put("/change-password", authMiddleware, authController.changePassword);

export default router;
