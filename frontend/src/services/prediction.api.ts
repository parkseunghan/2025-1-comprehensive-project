/**
 * prediction.api.ts
 * 이 파일은 증상 기록 ID를 기반으로 질병 예측 결과를 요청하는 API 연동 모듈입니다.
 * POST /predictions 요청을 통해 예측된 질병 리스트를 반환받습니다.
 */

import axios from "./axios";

/**
 * 🔹 PredictInput
 * @param recordId - 증상 기록 ID (사전에 생성 혹은 관리자 페이지에서 추가)
 */
export type PredictInput = {
    recordId: string;
};

/**
 * 🔹 PredictionResult
 * @property diseases - 예측된 질병 목록 (ex: ["감기", "폐렴"])
 */
export type PredictionResult = {
    result: string[];
    confidence?: number;      // 예: 0.92 (선택 사항)
    guideline?: string;       // 예: "충분한 수분 섭취"
};

/**
 * 🔹 requestPrediction
 * @function
 * @param {PredictInput} data - 예측을 요청할 증상 기록 ID
 * @returns {PredictionResult} 예측된 질병 배열
 *
 * POST /predictions/symptom-records/:recordId/prediction
 * 증상 기록 기반으로 AI 모델 예측 결과를 반환받습니다.
 */
export const requestPrediction = async ({ recordId }: PredictInput): Promise<PredictionResult> => {
    const res = await axios.post(`/predictions/symptom-records/${recordId}/prediction`);
    return res.data;
};
