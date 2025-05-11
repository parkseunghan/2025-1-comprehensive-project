// 📄 src/types/symptom.types.ts

// ✅ LLM 추출된 단일 증상 키워드
export interface LLMExtractKeyword {
  symptom: string;
  time: string | null;
}

// ✅ NLP 전체 응답 타입
export interface NlpExtractResponse {
  original: string;
  cleaned: string;
  translated: string;
  results: LLMExtractKeyword[];
}

// 🔹 DB에서 불러오는 Symptom 항목
export interface Symptom {
  id: string;
  name: string;
  category: string;
}