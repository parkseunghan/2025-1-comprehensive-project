// 📄 llm.routes.ts
// LLM 기반 증상 추출 API 라우터

import { Router } from "express";
import { extractSymptoms } from "../controllers/llm.controller";


const router = Router();

// [POST] /llm/extract - 자연어에서 증상 키워드 추출
// ✅ 한글 기반 추출
router.post("/extract", extractSymptoms);

// ✅ 영어 기반 추출


export default router;
