// 📄 src/services/prediction.service.ts

import axios from "../utils/axios"; // 공통 axios 인스턴스
import { PredictRequest, PredictResponse } from "@/types/prediction";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * AI 서버에 증상 데이터를 보내고 예측 결과를 받아옵니다.
 * @param data 예측 요청 데이터
 * @returns 예측 응답 데이터
 * @throws 서버 오류 또는 예측 실패 시 에러
 */
export async function requestPrediction(data: PredictRequest): Promise<PredictResponse> {
  try {
    const response = await axios.post<PredictResponse>("/predict", data);
    return response.data;
  } catch (error: any) {
    console.error("❌ [requestPrediction] AI 서버 요청 실패:", error.message);
    throw new Error("AI 예측 요청 중 오류가 발생했습니다."); // 프론트에서 에러 핸들링할 수 있게 throw
  }
}

/**
 * 🔹 예측 결과 저장
 */
export const save = async (recordId: string, predictions: any[]) => {
  const prediction = predictions[0]; // 가장 높은 확률의 예측 사용
  
  return await prisma.prediction.create({
    data: {
      recordId,
      coarseLabel: prediction.coarseLabel,
      fineLabel: prediction.fineLabel || prediction.coarseLabel,
      riskScore: prediction.riskScore,
      riskLevel: prediction.riskLevel,
      guideline: prediction.guideline,
    },
  });
};

/**
 * 🔹 예측 결과 조회
 */
export const findByRecord = async (recordId: string) => {
  return await prisma.prediction.findFirst({
    where: { recordId },
  });
};
