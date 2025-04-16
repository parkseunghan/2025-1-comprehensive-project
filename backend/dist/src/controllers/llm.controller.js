"use strict";
// 📄 llm.controller.ts
// 자연어 증상 문장에서 키워드를 추출하는 단독 테스트용 API
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
 * POST /llm/symptoms
 * 사용자의 자연어 증상 문장을 받아 증상 키워드를 추출해 반환
 */
const extractSymptomsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symptom_text } = req.body;
        if (!symptom_text || typeof symptom_text !== "string") {
            res.status(400).json({ message: "증상 문장을 입력해주세요." });
            return;
        }
        const keywords = yield (0, llm_service_1.extractSymptoms)(symptom_text);
        res.status(200).json({ keywords });
        return;
    }
    catch (error) {
        console.error("[extractSymptomsHandler] 오류:", error);
        res.status(500).json({ message: "증상 추출에 실패했습니다." });
        return;
    }
});
exports.extractSymptomsHandler = extractSymptomsHandler;
