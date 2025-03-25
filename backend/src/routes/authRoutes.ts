// src/routes/authRoutes.ts
// register(사용자 등록) 엔드포인트 라우팅

import express from 'express';
import { registerUser } from '../controllers/authController';

const router = express.Router();

// POST /register 경로를 registerUser 함수로 연결
router.post('/register', registerUser);


// 디버깅용
/*
router.post('/register', (req, res, next) => {
    console.log('Received request at /register:', req.body); // 요청 본문 로그 출력
    next(); // 다음 미들웨어로 넘김
}, registerUser);
*/

export default router;
