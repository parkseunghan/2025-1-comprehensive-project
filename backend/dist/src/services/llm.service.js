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
당신은 의료 전문 AI입니다.
다음 문장들에 포함된 증상을 **한국어로만**, **중복 없이**, 하나의 리스트로 추출하세요.
형식은 반드시 Python 리스트처럼 출력해야 합니다.
예시: ['기침', '두통', '가려움', '어지럼증']
문장: ${joined}
`.trim();
};
/**
 * 응답 문자열에서 증상 키워드만 정제 추출
 */
const cleanSymptoms = (raw) => {
    var _a;
    return ((_a = raw
        .match(/'([^']+)'/g)) === null || _a === void 0 ? void 0 : _a.map((s) => s.replace(/'/g, '').trim()).filter((s) => /^[가-힣]+$/.test(s))) || [];
};
/**
 * mistral 모델에 증상 추출 요청
 */
const extractSymptomsFromLLM = (sentences) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 프롬프트 생성
    const prompt = buildPrompt(sentences);
    // 2. Ollama 서버로 POST 요청
    const res = yield axios_1.default.post("http://localhost:11434/api/generate", {
        model: "mistral", // 실행 중인 모델 이름
        prompt,
        stream: false // 스트리밍 응답 비활성화
    });
    // 3. 응답에서 증상 키워드 정제
    const raw = res.data.response.trim();
    const symptoms = cleanSymptoms(raw);
    return symptoms;
});
exports.extractSymptomsFromLLM = extractSymptomsFromLLM;
