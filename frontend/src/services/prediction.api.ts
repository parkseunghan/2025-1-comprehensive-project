// 📄 prediction.api.ts
// 증상 기록 기반으로 AI 예측 결과를 요청하거나 가져오는 API

import axios from "./axios";
import {
  PredictInput,             // { recordId: string }
  PredictionResult,         // DB 저장된 예측 결과
  PredictRequest,           // { symptomKeywords, age, gender, ... }
  PredictResponse           // { predictions: [{ coarseLabel, fineLabel, riskScore }, ...] }
} from "../types/prediction";

/**
 * 🔹 기존 증상 기록 기반 예측 결과를 DB에 저장
 * @route POST /api/predictions/symptom-records/:recordId/prediction
 */
export const requestPredictionToDB = async (
  { recordId, predictions }: { recordId: string; predictions: PredictionResult[] }
): Promise<any> => {
  const res = await axios.post(`/prediction/symptom-records/${recordId}/prediction`, {
    predictions,
  });
  return res.data;
};

/**
 * 🔹 [2] 기존 증상 기록 기반 예측 결과 조회
 * @route GET /api/predictions/symptom-records/:recordId/prediction
 */
export const getPredictionByRecord = async (
  recordId: string
): Promise<PredictionResult> => {
  const res = await axios.get(`/prediction/symptom-records/${recordId}/prediction`);
  return res.data;
};

/**
 * 🔹 [3] 실시간 AI 예측 요청 → `/api/prediction` (AI 서버와 연동)
 * @route POST /api/prediction
 */
export const requestPrediction = async (
  data: PredictRequest
): Promise<PredictResponse> => {
  const res = await axios.post("/prediction", data);
  return res.data;
};
