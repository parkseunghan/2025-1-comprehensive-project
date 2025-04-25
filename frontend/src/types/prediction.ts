// 📄 src/types/prediction.ts
// 예측 API 요청 및 응답 타입 정의

/**
 * 🔹 기존: 증상 기록 기반 예측 요청
 */
export interface PredictInput {
  recordId: string;
  symptoms?: {
    symptom: string;
    time: string | null;
  }[];
}

/**
 * 🔹 기존: DB 저장된 예측 결과 구조
 */
export interface PredictionResult {
  coarseLabel: string;
  riskScore: number;
  riskLevel: string;
  guideline: string;

  top1?: string;
  top1Prob?: number;
  top2?: string;
  top2Prob?: number;
  top3?: string;
  top3Prob?: number;

  elapsedSec?: number;
}

/**
 * ✅ 추가: 실시간 AI 예측 요청용
 */
export interface PredictRequest {
  symptomKeywords: string[];
  age: number;
  gender: "남성" | "여성";
  height: number;
  weight: number;
  bmi: number;
  diseases: string[];
  medications: string[];
}

/**
 * ✅ 추가: AI 예측 응답 (Top-3 리스트)
 */
export interface PredictResponse {
  predictions: {
    coarseLabel: string;
    fineLabel?: string;
    riskScore: number;
  }[];
}
