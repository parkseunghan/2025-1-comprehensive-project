"use strict";
// 📄 llm.controller.ts
// 사용자 입력 문장에서 증상을 추출하는 컨트롤러
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSymptoms = void 0;
const llm_service_1 = require("../services/llm.service");
/**
 * POST /llm/extract
 * 사용자 문장 리스트를 받아 증상 키워드만 추출
 */
const extractSymptoms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { texts } = req.body;
    if (!Array.isArray(texts) || texts.length === 0) {
        res.status(400).json({ message: "ko: 문장 배열이 필요합니다." });
        return;
    }
    try {
        const symptoms = yield (0, llm_service_1.extractSymptomsFromLLM)(texts);
        res.status(200).json({ symptoms });
    }
    catch (error) {
        console.error("❌ko: LLM 호출 오류:", error);
        res.status(500).json({ message: "ko: 증상 추출 실패" });
    }
});
exports.extractSymptoms = extractSymptoms;
