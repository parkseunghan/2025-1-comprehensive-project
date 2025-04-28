import { Router, RequestHandler } from "express";
import {
  predictFromAI,
  savePredictions,
  getPredictionByRecord
} from "../controllers/prediction.controller";

const router = Router();

// ✅ 1. AI 서버에 예측 요청
router.post("/", predictFromAI as RequestHandler);

// ✅ 2. 증상 기록 기반 예측 결과 저장
router.post("/symptom-records/:recordId/prediction", savePredictions as RequestHandler);

// ✅ 3. 증상 기록 기반 예측 결과 조회
router.get("/symptom-records/:recordId/prediction", getPredictionByRecord as RequestHandler);

export default router;
