// 📄 src/services/prediction.service.ts
// AI 서버와의 통신 및 예측 결과 저장 로직 정의

import axios from "../utils/ai-api"; // 공통 axios 인스턴스
import { PredictRequest, PredictResponse, PredictionCandidate } from "@/types/prediction.types";
import prisma from "../config/prisma.service";

/**
 * AI 서버에 증상 데이터를 보내고 예측 결과를 받아옵니다.
 * @param data 예측 요청 데이터
 * @returns 예측 응답 데이터
 * @throws 서버 오류 또는 예측 실패 시 에러
 */
export async function requestPrediction(data: PredictRequest): Promise<PredictResponse> {
  try {
    console.log("🚀 [Axios] 예측 요청 전송 중...");
    console.log("📡 보낼 데이터:", data);
    const response = await axios.post<PredictResponse>("/predict", data);
    console.log("✅ [Axios] 응답 도착:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ [requestPrediction] AI 서버 요청 실패:", error?.response?.data || error.message);
    throw error; // 👈 반드시 원본 에러 그대로 던져야 프론트에서 .response.data 접근 가능
  }
}

/**
 * 예측 결과를 DB에 저장합니다. (Prediction + PredictionRank)
 * @param recordId 해당 예측이 연결된 증상 기록 ID
 * @param predictions Top-N 예측 결과 배열
 */
export async function save(recordId: string, predictions: PredictionCandidate[]) {
  const top1 = predictions[0];

  console.log("📝 [Prediction 저장] recordId:", recordId);
  console.log("📝 top1:", top1);

  // Prediction + 연결된 PredictionRank 생성
  return await prisma.prediction.create({
    data: {
      recordId,
      coarseLabel: top1.coarseLabel,
      fineLabel: top1.fineLabel,
      riskScore: top1.riskScore,
      riskLevel: top1.riskLevel,
      guideline: top1.guideline,
      ranks: {
        create: predictions.map((p, i) => ({
          rank: i + 1,
          coarseLabel: p.coarseLabel,
          fineLabel: p.fineLabel,
          riskScore: p.riskScore,
        })),
      },
    },
  });
}

/**
 * 예측 결과를 증상 기록 기준으로 조회합니다.
 * @param recordId 연결된 증상 기록 ID
 */
export const findByRecord = async (recordId: string) => {
  return await prisma.prediction.findUnique({
    where: { recordId },
    include: { ranks: true },
  });
};

/**
 * 사용자 전체 예측 통계 데이터를 반환합니다.
 * - 질병 분포, 위험도 평균, 예측 일시 등 포함
 * @param userId 로그인한 사용자 ID
 */
export const getPredictionStats = async (userId: string) => {
  const predictions = await prisma.prediction.findMany({
    where: {
      record: {
        userId,
      },
    },
    select: {
      id: true,                // ✅ 기본키 ID 추가
      coarseLabel: true,
      fineLabel: true,
      riskScore: true,
      riskLevel: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return predictions;
};
