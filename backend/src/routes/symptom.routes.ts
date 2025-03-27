// 🔹 symptom.routes.ts
// 이 파일은 '증상(Symptom)' 관련 API 바이드리기를 정의합니다.
// /symptoms 로 목록 및 검색, /:id로 특정 증상 조회에 사용됩니다.

import { Router } from "express";
import * as symptomController from "../controllers/symptom.controller";

const router = Router();

// [GET] /symptoms - 증상 목록 조회
router.get("/", symptomController.getAllSymptoms);

// [GET] /symptoms/:id - 특정 증상 조회
router.get("/:id", symptomController.getSymptomById);

export default router;
