// 📄 src/services/prediction.service.ts

import axios from "../utils/ai-api"; // 공통 axios 인스턴스
import { PredictRequest, PredictResponse } from "@/types/prediction";
import prisma from "../config/prisma.service"; // ✅ 수정됨: 기존 new PrismaClient() 제거

/**
 * AI 서버에 증상 데이터를 보내고 예측 결과를 받아옵니다.
 * @param data 예측 요청 데이터
 * @returns 예측 응답 데이터
 * @throws 서버 오류 또는 예측 실패 시 에러
 */
export async function requestPrediction(data: PredictRequest): Promise<PredictResponse> {
  try {
    console.log("🚀 [Axios] 예측 요청 전송 중...");
    console.log("📡 보낼 데이터:", data); // ✅ 전송 데이터 확인용
    const response = await axios.post<PredictResponse>("/predict", data);
    console.log("✅ [Axios] 응답 도착:", response.data); // ✅ 응답 데이터 확인용
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
  const top1 = predictions[0];
  const top2 = predictions[1] ?? {};
  const top3 = predictions[2] ?? {};

  console.log("📝 [Prediction 저장] recordId:", recordId);
  console.log("📝 top1:", top1);

  return await prisma.prediction.create({
    data: {
      recordId,
      coarseLabel: top1.coarseLabel,
      // fineLabel: top1.fineLabel || top1.coarseLabel,
      riskScore: top1.riskScore,
      riskLevel: top1.riskLevel,
      guideline: top1.guideline,

      top1: top1.fineLabel || top1.coarseLabel,
      top1Prob: top1.riskScore,
      top2: top2.fineLabel || top2.coarseLabel || "",
      top2Prob: top2.riskScore ?? 0,
      top3: top3.fineLabel || top3.coarseLabel || "",
      top3Prob: top3.riskScore ?? 0,
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
