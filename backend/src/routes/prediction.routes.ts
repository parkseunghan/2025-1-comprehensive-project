// 🔹 prediction.routes.ts
// 이 파일은 '예측(Prediction)' 관련 API 라우트를 정의합니다.
// 증상 기록 기반 예측 생성 및 조회 기능을 제공합니다.

import { Router } from "express";
import * as predictionController from "../controllers/prediction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

// [POST] /symptom-records/:recordId/prediction - 예측 생성 요청
router.post("/symptom-records/:recordId/prediction", authMiddleware, predictionController.createPrediction);

// [GET] /symptom-records/:recordId/prediction - 예측 결과 조회
router.get("/symptom-records/:recordId/prediction", authMiddleware, predictionController.getPredictionByRecord);

// [DELETE] /symptom-records/:recordId/prediction - 예측 삭제
router.delete("/symptom-records/:recordId/prediction", authMiddleware, predictionController.deletePrediction);

// [POST] /symptom-records/:recordId/prediction/retry - 예측 재요청 (삭제 후 생성)
router.post("/symptom-records/:recordId/prediction/retry", authMiddleware, predictionController.recreatePrediction);

export default router;
