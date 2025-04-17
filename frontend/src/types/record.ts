// 📄 src/types/record.ts
// 증상 기록 관련 API 요청/응답 타입 정의

/**
 * 🔹 SubmitSymptomInput
 * 사용자가 증상 기록을 생성할 때 전달하는 요청 형식
 * @property userId - 현재 사용자 ID
 * @property symptomIds - 선택한 증상의 ID 배열 (빈 배열 허용)
 */
export interface SubmitSymptomInput {
    userId: string;
    symptomIds: string[];
  }
  
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
  