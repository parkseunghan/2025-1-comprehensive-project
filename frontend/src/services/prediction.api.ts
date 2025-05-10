// 📄 prediction.api.ts
// 증상 기록 기반으로 AI 예측 결과를 요청하거나 가져오는 API

import axios from "./axios";
import {
  PredictRequest,           // { symptomKeywords, age, gender, ... }
  PredictResponse,          // { predictions: [...] }
  Prediction,               // DB 저장된 Prediction 객체
  PredictionRank            // Top-N 후보 리스트
} from "@/types/prediction.types";

/**
 * 🔹 1. 기존 증상 기록 기반 예측 결과를 DB에 저장
 * @route POST /api/predictions/symptom-records/:recordId/prediction
 */
export const requestPredictionToDB = async (
  {
    recordId,
    predictions,
  }: {
    recordId: string;
    predictions: PredictionRank[]; // Top-N 후보 리스트만 전송
  }
): Promise<any> => {
  const res = await axios.post(`/prediction/symptom-records/${recordId}/prediction`, {
    predictions,
  });
  return res.data;
};

/**
 * 🔹 2. 기존 증상 기록 기반 예측 결과 조회
 * @route GET /api/predictions/symptom-records/:recordId/prediction
 */
export const getPredictionByRecord = async (
  recordId: string
): Promise<Prediction & { ranks: PredictionRank[] }> => {
  const res = await axios.get(`/prediction/symptom-records/${recordId}/prediction`);
  return res.data;
};

/**
 * 🔹 3. 실시간 AI 예측 요청 → `/api/prediction` (AI 서버와 연동)
 * @route POST /api/prediction
 */
export const requestPrediction = async (
  data: PredictRequest
): Promise<PredictResponse> => {
  const res = await axios.post("/prediction", data);
  return res.data;
};

/**
 * 🔹 4. 사용자 전체 예측 통계 조회
 * @route GET /api/prediction/stats
 */
export const fetchPredictionStats = async (): Promise<Prediction[]> => {
  const res = await axios.get("/prediction/stats");
  return res.data;
};