"use strict";
// 🔹 auth.routes.ts
// 인증 관련 API 라우트 정의
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_1.signup); // 회원가입 처리
router.post('/login', auth_controller_1.login); // 로그인 처리
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.me); // 로그인한 사용자 정보 조회
exports.default = router;
