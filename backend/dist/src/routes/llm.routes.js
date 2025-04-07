"use strict";
// 📄 llm.routes.ts
// LLM 기반 증상 추출 API 라우터
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const llm_controller_1 = require("../controllers/llm.controller");
const router = (0, express_1.Router)();
// [POST] /llm/extract - 자연어에서 증상 키워드 추출
// ✅ 한글 기반 추출
router.post("/extract", llm_controller_1.extractSymptoms);
// ✅ 영어 기반 추출
exports.default = router;
