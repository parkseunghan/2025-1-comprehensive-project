// 📄 src/types/symptom.types.ts

// 🔹 LLM 추출 결과용
export interface LLMExtractKeyword {
  symptom: string;
  time: string | null;
}

// 🔹 DB에서 불러오는 Symptom 항목
export interface Symptom {
  id: string;
  name: string;
  category: string;
}