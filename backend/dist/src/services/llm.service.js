"use strict";
// 📄 llm.service.ts
// Ollama + mistral 연동을 통해 증상 키워드를 추출하는 서비스 계층
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSymptomsFromLLM = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * 사용자 입력 문장들로 프롬프트 구성
 */
const buildPrompt = (sentences) => {
    const joined = sentences.map((s) => `"${s}"`).join(", ");
    return `
You are a medical AI that specializes in extracting symptoms from user input.

- Your task is to extract **ONLY the symptoms explicitly mentioned** in the text.  
- Do NOT guess or infer symptoms not mentioned.  
- Do NOT include explanations, translations, or full sentences.  
- Do NOT include Korean.

- Respond ONLY with a valid JSON array of English symptom keywords.

- Format: ["headache", "cough", "itchy skin"]  
- Invalid: "I have a cough.", "My head hurts.", ["기침", "두통"]

Sentences: ${joined}
`.trim();
};
/**
 * 응답 문자열에서 증상 키워드만 정제 추출
 */
const cleanSymptoms = (raw) => {
    try {
        // 여러 줄 중 JSON 배열만 필터링
        const matches = raw.match(/\[.*?\]/g); // 여러 배열 추출
        if (!matches)
            return [];
        const parsed = matches
            .map((m) => JSON.parse(m))
            .flat()
            .map((s) => s.toLowerCase().trim())
            .filter((s) => /^[a-z\s]+$/.test(s) && s.length < 40); // 영어 증상만 필터링
        return [...new Set(parsed)]; // 중복 제거
    }
    catch (e) {
        console.warn("증상 파싱 실패:", raw);
        return [];
    }
};
/**
 * mistral 모델에 증상 추출 요청
 */
const extractSymptomsFromLLM = (sentences) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = buildPrompt(sentences);
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        const res = yield axios_1.default.post("http://localhost:11434/api/generate", {
            model: "mistral",
            prompt,
            stream: false,
        });
        const raw = res.data.response.trim();
        console.log(`[${i + 1}] LLM 응답:`, raw);
        const symptoms = cleanSymptoms(raw);
        if (symptoms.length > 0)
            return symptoms;
    }
    return [];
});
exports.extractSymptomsFromLLM = extractSymptomsFromLLM;
