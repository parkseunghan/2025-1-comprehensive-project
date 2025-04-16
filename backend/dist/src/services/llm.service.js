"use strict";
// 📄 llm.service.ts
// 자연어 증상 문장에서 증상 키워드 및 시간 정보를 LLM으로 추출하는 서비스 (번역 + 추출 → 매핑 → 한글)
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
exports.extractSymptoms = void 0;
const axios_1 = __importDefault(require("axios"));
const normalizeSymptoms_1 = require("../utils/normalizeSymptoms");
const getKoreanLabels_1 = require("../utils/getKoreanLabels");
/**
 * 자연어 증상 문장에서 증상 + 시간 정보 추출 (최대 3회 시도 후 중복 제거)
 * @param symptomText 사용자가 입력한 문장 (한글)
 * @returns [{ symptom: string, time: string | null }]
 */
const extractSymptoms = (symptomText) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    const prompt = `You are a medical AI that specializes in extracting symptoms from user input.

Your task is to extract ONLY the medical symptoms explicitly mentioned in the following Korean sentence.
- DO NOT guess symptoms that are not clearly stated.
- DO NOT infer, translate, or explain.
- DO NOT include Korean.
- DO NOT add modifiers like (mild), (severe), etc.
- DO NOT include adjectives like "persistent", "chronic", or "frequent" in the symptom field. Instead, express them using the "time" field as "persistent".
Respond ONLY with a valid JSON array of objects.
Each object must include:
- "symptom": an English medical keyword (e.g., "fever", "cough", "abdominal pain")
- "time": "morning", "afternoon", "evening", "night", "persistent" (if the symptom is **frequent or chronic**), or null

Valid Output:
[
  { "symptom": "fever", "time": "night" },
  { "symptom": "headache", "time": null },
  { "symptom": "cough", "time": "persistent" }
]

Now extract symptoms from this sentence:
"${symptomText}"`;
    for (let i = 0; i < 3; i++) {
        console.log(`[extractSymptoms] 🔁 LLM 요청 시도 ${i + 1}...`);
        try {
            const res = yield axios_1.default.post("http://localhost:11434/api/generate", {
                model: "mistral",
                stream: false,
                prompt,
            });
            const raw = res.data.response.trim();
            console.log(`[extractSymptoms] ✅ 응답 수신 (시도 ${i + 1}): ${raw}`);
            let parsed = [];
            try {
                parsed = JSON.parse(raw);
            }
            catch (e) {
                console.warn(`[extractSymptoms] ⚠️ 응답 파싱 실패 (시도 ${i + 1})`, raw);
                continue;
            }
            results.push(parsed);
        }
        catch (e) {
            console.error(`[extractSymptoms] ❌ LLM 요청 실패 (시도 ${i + 1})`, e);
        }
    }
    // ✅ 시간 우선순위 기반 중복 제거 처리
    const uniqueMap = new Map();
    const timePriority = {
        morning: 3,
        afternoon: 3,
        evening: 3,
        night: 3,
        persistent: 2,
        "": 1,
        null: 1,
    };
    results.flat().forEach(({ symptom, time }) => {
        var _a;
        let cleanSymptom = symptom.replace(/\s*\(.*?\)/g, "").trim().toLowerCase();
        // ✅ "persistent cough" 보정: time으로 이동
        let adjustedTime = time;
        if (cleanSymptom.startsWith("persistent ")) {
            cleanSymptom = cleanSymptom.replace("persistent ", "").trim();
            adjustedTime = "persistent";
        }
        const normalized = (0, normalizeSymptoms_1.normalizeSymptoms)([cleanSymptom])[0];
        const korean = (0, getKoreanLabels_1.getKoreanLabels)([normalized])[0];
        const key = korean;
        const currentPriority = timePriority[adjustedTime !== null && adjustedTime !== void 0 ? adjustedTime : ""] || 0;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, { symptom: korean, time: adjustedTime });
        }
        else {
            const existing = uniqueMap.get(key);
            const existingPriority = timePriority[(_a = existing.time) !== null && _a !== void 0 ? _a : ""] || 0;
            if (currentPriority > existingPriority) {
                uniqueMap.set(key, { symptom: korean, time: adjustedTime });
            }
        }
    });
    const final = Array.from(uniqueMap.values());
    console.log(`[extractSymptoms] 🧪 최종 정제 결과:`, JSON.stringify(final, null, 2));
    return final;
});
exports.extractSymptoms = extractSymptoms;
