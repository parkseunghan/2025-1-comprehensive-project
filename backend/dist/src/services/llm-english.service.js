"use strict";
// 📄 llm-english.service.ts
// Ollama + mistral + 영어 기반 증상 추출 서비스
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
exports.extractSymptomsFromEnglish = void 0;
const axios_1 = __importDefault(require("axios"));
const translate_util_1 = require("../utils/translate.util");
const symptom_en_ko_map_json_1 = __importDefault(require("../data/symptom-en-ko-map.json"));
const symptomMap = symptom_en_ko_map_json_1.default;
/**
 * 영어 기반 증상 추출용 프롬프트 생성
 */
const buildEnglishPrompt = (englishText) => {
    return `
You are a medical diagnosis AI.
Extract all the symptoms from the following English sentence.
Respond with a JSON-style array like: ["cough", "headache", "itching"].
Text: ${englishText}
`.trim();
};
/**
 * 영어 증상 → 한국어 표준 증상 변환
 */
const mapToKoreanSymptoms = (raw) => {
    return [...new Set(raw.map((s) => symptomMap[s.toLowerCase()] || s))];
};
/**
 * mistral에 영어로 증상 추출 요청
 */
const extractSymptomsFromEnglish = (texts) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 번역
    const english = (0, translate_util_1.translateToEnglish)(texts);
    // 2. 프롬프트 생성
    const prompt = buildEnglishPrompt(english);
    // 3. Ollama 요청
    const res = yield axios_1.default.post("http://localhost:11434/api/generate", {
        model: "mistral",
        prompt,
        stream: false
    });
    const raw = res.data.response.trim();
    console.log("[LLM 응답]", raw); // 🔍 실제 응답 출력
    // 4. 영어 증상 추출 + 매핑
    const match = raw.match(/"([^"]+)"/g) || [];
    console.log("[정규식 추출]", match); // 🔍 실제 파싱 결과
    const rawList = match.map((m) => m.replace(/"/g, ""));
    const korean = mapToKoreanSymptoms(rawList);
    return korean;
});
exports.extractSymptomsFromEnglish = extractSymptomsFromEnglish;
