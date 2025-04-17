// 📄 prediction.api.ts
// 증상 기록 기반으로 AI 예측 결과를 요청하거나 가져오는 API

import axios from "./axios";
import { PredictInput, PredictionResult } from "../types/prediction";

/**
 * 🔹 예측 요청 (POST)
 * @route POST /predictions/symptom-records/:recordId/prediction
 * @param {PredictInput} data - 예측할 증상 기록 ID
 * @returns {PredictionResult} - 예측된 결과 (Top-3 질병 + 부가 정보)
 */
export const requestPrediction = async (
    { recordId }: PredictInput
): Promise<PredictionResult> => {
    const res = await axios.post(`/predictions/symptom-records/${recordId}/prediction`);
    return res.data;
};

/**
 * 🔹 예측 결과 조회 (GET)
 * @route GET /predictions/symptom-records/:recordId/prediction
 * @param recordId - 증상 기록 ID
 * @returns {PredictionResult} - 기존에 저장된 예측 결과
 */
export const getPredictionByRecord = async (
    recordId: string
): Promise<PredictionResult> => {
    const res = await axios.get(`/predictions/symptom-records/${recordId}/prediction`);
    return res.data;
};
