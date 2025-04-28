"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prediction_controller_1 = require("../controllers/prediction.controller");
const router = (0, express_1.Router)();
// ✅ 1. AI 서버에 예측 요청
router.post("/", prediction_controller_1.predictFromAI);
// ✅ 2. 증상 기록 기반 예측 결과 저장
router.post("/symptom-records/:recordId/prediction", prediction_controller_1.savePredictions);
// ✅ 3. 증상 기록 기반 예측 결과 조회
router.get("/symptom-records/:recordId/prediction", prediction_controller_1.getPredictionByRecord);
exports.default = router;
