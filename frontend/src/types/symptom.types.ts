// 📄 src/types/symptom.types.ts

// ✅ 추출된 단일 증상 키워드
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