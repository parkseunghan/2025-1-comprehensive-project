// 🔹 auth.routes.ts
// 인증 관련 API 라우트 정의

import { Router } from 'express';
import { signup, login, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', signup);  // 회원가입 처리
router.post('/login', login);    // 로그인 처리
router.get('/me', authMiddleware, me);  // 로그인한 사용자 정보 조회

export default router;
