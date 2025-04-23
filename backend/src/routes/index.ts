// 🔹 routes/index.ts
// 이 파일은 모든 API 도메인별 라우터를 통합하여 Express 애플리케이션에 연결하는 진입점입니다.

import { Router } from "express";
import userRoutes from "./user.routes";
import diseaseRoutes from "./disease.routes";
import symptomRoutes from "./symptom.routes";
import recordRoutes from "./record.routes";
import predictionRoutes from "./prediction.routes";
import authRoutes from "./auth.routes"
import llmRoutes from "./llm.routes"
import medicationRoutes from "./medication.routes";

const router = Router();

// 사용자 관련 라우터 연결 (/api/users)
router.use("/users", userRoutes);

// 지병 관련 라우터 연결 (/api/diseases)
router.use("/diseases", diseaseRoutes);

// 증상 관련 라우터 연결 (/api/symptoms)
router.use("/symptoms", symptomRoutes);

// 증상 기록 관련 라우터 연결 (/api/records)
router.use("/records", recordRoutes);

// 예측 관련 라우터 연결 (/api/predictions)
router.use("/predictions", predictionRoutes);

// 인증 관련 라우터 연결 (/api/auth)
router.use("/auth", authRoutes);

// LLM 기반 증상 추출 관련 라우터 연결 (/api/llm)
router.use("/llm", llmRoutes);

// 약물 관련 라우터 연결 (/api/medications)
router.use("/medications", medicationRoutes);

router.use("/prediction", predictionRoutes);

export default router;
