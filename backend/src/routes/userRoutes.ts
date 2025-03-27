// src/routes/userRoutes.ts
// getUserInfo(사용자 정보 조회) 엔드포인트 라우팅

import express from 'express';
import { getUserInfo } from '../controllers/userController';

const router = express.Router();

// 사용자 정보 조회 API
router.get('/:userId', getUserInfo);

export default router;