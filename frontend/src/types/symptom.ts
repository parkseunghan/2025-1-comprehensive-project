// 📄 src/types/symptom.ts
// LLM 증상 추출 결과 타입 정의

export interface LLMExtractKeyword {
    symptom: string;
    time: string | null;
  }
  