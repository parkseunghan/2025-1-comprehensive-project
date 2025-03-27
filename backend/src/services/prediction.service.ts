// 🔹 prediction.service.ts
// 이 파일은 예측(Prediction) 관련 비즈니스 로직을 담당하는 서비스 계층입니다.
// 증상 기록 기반으로 예측 결과를 생성하거나, 기존 예측 결과를 조회합니다.

import { predictions } from "../mock/predictions"; // 더미 예측 데이터

/**
 * 예측 생성 (임시 더미 결과 기반)
 * @param recordId 예측 대상 증상 기록 ID
 */
export const create = (recordId: string) => {
  const already = predictions.find((p) => p.recordId === recordId);
  if (already) return { message: "Prediction already exists" };

  const newPrediction = {
    id: `pred-${Date.now()}`,
    recordId,
    result: "감기",
    confidence: 0.91,
    guideline: "수분 섭취와 휴식을 충분히 취하세요.",
    createdAt: new Date().toISOString(),
  };
  predictions.push(newPrediction);
  return newPrediction;
};

/**
 * 특정 증상 기록 ID로 예측 결과 조회
 * @param recordId 대상 증상 기록 ID
 */
export const findByRecordId = (recordId: string) => {
  return predictions.find((p) => p.recordId === recordId);
};