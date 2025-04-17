"use strict";
// 📄 llm.controller.ts
// 자연어 증상 문장에서 키워드를 추출하는 LLM 추론 API 컨트롤러
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
exports.extractSymptomsHandler = void 0;
const llm_service_1 = require("../services/llm.service");
/**
 * POST /llm/extract
 * 사용자의 자연어 문장에서 증상 키워드를 추출하여 반환
 */
const extractSymptomsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symptomText } = req.body; // ✅ camelCase로 수정
        if (!symptomText || typeof symptomText !== "string") {
            res.status(400).json({ message: "symptomText는 문자열로 입력되어야 합니다." });
            return;
        }
        const keywords = yield (0, llm_service_1.extractSymptoms)(symptomText); // ✅ 그대로 사용
        res.status(200).json({ keywords });
    }
    catch (error) {
        console.error("[extractSymptomsHandler] 오류:", error);
        res.status(500).json({ message: "증상 추출에 실패했습니다." });
    }
});
exports.extractSymptomsHandler = extractSymptomsHandler;
