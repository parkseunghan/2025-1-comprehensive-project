// 📄 record.service.ts
// 예측 결과와 증상 + 시간 정보를 Prisma를 통해 DB에 저장하는 서비스

import prisma from "../config/prisma.service";

interface PredictionResult {
  coarse_label: string;
  risk_score: number;
  risk_level: string;
  recommendation: string;
  elapsed: number;
  top_predictions: { label: string; prob: number }[];
  recordId: string;
}

/**
 * 예측 결과 저장
 */
export const savePredictionResult = async (
  recordId: string,
  result: PredictionResult
) => {
  await prisma.prediction.create({
    data: {
      recordId: recordId,
      coarseLabel: result.coarse_label,
      riskScore: result.risk_score,
      riskLevel: result.risk_level,
      guideline: result.recommendation,
      elapsedSec: result.elapsed,

      top1: result.top_predictions[0]?.label ?? null,
      top1Prob: result.top_predictions[0]?.prob ?? null,
      top2: result.top_predictions[1]?.label ?? null,
      top2Prob: result.top_predictions[1]?.prob ?? null,
      top3: result.top_predictions[2]?.label ?? null,
      top3Prob: result.top_predictions[2]?.prob ?? null,
    },
  });
};

/**
 * 증상 + 시간 정보 저장
 */
export const saveSymptomsToRecord = async (
  recordId: string,
  symptoms: { symptom: string; time: string | null }[]
) => {
  // 기존 증상 모두 삭제
  await prisma.symptomOnRecord.deleteMany({ where: { recordId } });

  for (const item of symptoms) {
    // 증상명이 존재하는 경우 연결 (이미 등록된 Symptom 테이블 기준)
    const symptom = await prisma.symptom.findUnique({
      where: { name: item.symptom },
    });

    if (symptom) {
      await prisma.symptomOnRecord.create({
        data: {
          recordId,
          symptomId: symptom.id,
          timeOfDay: item.time ?? null,
        },
      });
    }
  }
};
