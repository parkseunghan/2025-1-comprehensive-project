// 📄 src/types/prediction.types.ts

/**
 * 🔹 프론트엔드 전용 Prediction 관련 타입 정의 파일
 */

// ✅ AI 서버로 보낼 예측 요청 데이터
export interface PredictRequest {
  symptomKeywords: string[];
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  diseases?: string[];
  medications?: string[];
}

// ✅ AI 서버 응답 구조
export interface PredictResponse {
  predictions: PredictionRank[]; // coarseLabel, fineLabel, riskScore
}

// ✅ 예측 후보 하나 (Top-N)
export interface PredictionRank {
  coarseLabel: string;
  fineLabel: string;
  riskScore: number;
}

// ✅ DB에 저장된 최종 Prediction 결과 (Top-1 기준)
export interface Prediction {
  id: string;
  recordId: string;
  coarseLabel: string;
  fineLabel: string;
  riskScore: number;
  riskLevel: string;
  guideline: string;
  elapsedSec?: number;
  createdAt: string;
}

export interface PredictionRank {
  rank: number;
  coarseLabel: string;
  fineLabel: string;
  riskScore: number;
}
