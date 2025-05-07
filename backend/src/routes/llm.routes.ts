// 📄 llm.routes.ts
// LLM 기반 증상 추출 API 라우터

import { Router } from "express";
import { extractSymptomsHandler } from "../controllers/llm.controller";

const router = Router();

// [POST] /llm/extract - 자연어에서 증상 키워드 추출
// ✅ 한글 기반 추출
router.post("/extract", extractSymptomsHandler);

// ✅ 영어 기반 추출


export default router;


// // 📄 llm.routes.ts

// import express from "express";
// import { cleanSymptomTextHandler } from "../controllers/llm.controller";

// const router = express.Router();

// /**
//  * @route POST /api/llm/clean
//  * @desc 사용자 입력 문장 정제
//  */
// router.post("/clean", cleanSymptomTextHandler);

// export default router;
