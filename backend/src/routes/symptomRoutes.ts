// src/routes/symptomRoutes.ts
// symptoms(증상) 엔드포인트 라우팅

import express from 'express';
import { addSymptom } from '../controllers/symptomController';

const router = express.Router();

router.post('/', addSymptom);

export default router;