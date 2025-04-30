// 📄 record.types.ts
// 증상 기록 관련 API 요청/응답 타입 정의

/**
 * 🔹 SymptomRecord
 * 하나의 증상 기록을 나타내는 응답 타입
 */
export interface SymptomRecord {
  id: string;
  userId: string;
  symptoms: {
    id: string;
    name: string;
    timeOfDay?: string | null;
  }[];
  createdAt: string; // ISO string 형태
}
