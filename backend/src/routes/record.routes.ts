// 🔹 record.routes.ts
// 이 파일은 '증상 기록(SymptomRecord)' 관련 API 라우트를 정의합니다.
// 사용자 증상 기록 생성 및 조회에 사용됩니다.

import { Router } from "express";
import * as recordController from "../controllers/record.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

// [POST] /users/:userId/symptom-records - 증상 기록 생성
router.post("/user/:userId/symptom-records", authMiddleware, recordController.createSymptomRecord);

// [GET] /users/:userId/symptom-records - 특정 사용자 증상 기록 전체 조회
router.get("/user/:userId/symptom-records", authMiddleware, recordController.getSymptomRecordsByUser);

// [GET] /symptom-records/:id - 개별 증상 기록 조회
router.get("/symptom-records/:id", authMiddleware, recordController.getSymptomRecordById);

// [DELETE] /symptom-records/:id - 증상 기록 삭제
router.delete("/symptom-records/:id", authMiddleware, recordController.deleteSymptomRecord);

export default router;
