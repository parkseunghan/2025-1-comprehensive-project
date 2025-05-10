import { Router, RequestHandler } from "express";
import {
  predictFromAI,
  savePredictions,
  getPredictionByRecord,
  getPredictionStats, // 📌 새로 추가된 통계 조회 컨트롤러
} from "../controllers/prediction.controller";
import { authMiddleware } from "../middlewares/auth.middleware"; // 🔒 사용자 인증 미들웨어 추가

const router = Router();

// ✅ 1. AI 서버에 예측 요청
router.post("/", predictFromAI as RequestHandler);

// ✅ 2. 증상 기록 기반 예측 결과 저장
router.post("/symptom-records/:recordId/prediction", savePredictions as RequestHandler);

// ✅ 3. 증상 기록 기반 예측 결과 조회
router.get("/symptom-records/:recordId/prediction", getPredictionByRecord as RequestHandler);

// ✅ 4. 사용자 전체 예측 통계 조회
router.get("/stats", authMiddleware, getPredictionStats as RequestHandler);

export default router;
