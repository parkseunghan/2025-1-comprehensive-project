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
 * 진단 기록 생성
 */
export const create = async (userId: string, symptomIds: string[]) => {
    const record = await prisma.symptomRecord.create({
      data: { userId },
    });
  
    for (const id of symptomIds) {
      const symptom = await prisma.symptom.findUnique({ where: { id } });
      if (symptom) {
        await prisma.symptomOnRecord.create({
          data: {
            recordId: record.id,
            symptomId: symptom.id,
            timeOfDay: null, // 나중에 시간 정보 받을 수 있도록 확장 가능
          },
        });
      }
    }
  
    return record;
  };
  

/**
 * 사용자별 진단 기록 조회
 */
export const findByUserId = async (userId: string) => {
  return prisma.symptomRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      prediction: true,
      symptoms: {
        include: { symptom: true },
      },
    },
  });
};

/**
 * 특정 진단 기록 상세 조회
 */
export const findById = async (id: string) => {
  return prisma.symptomRecord.findUnique({
    where: { id },
    include: {
      prediction: true,
      symptoms: {
        include: { symptom: true },
      },
    },
  });
};

/**
 * 진단 기록 삭제
 */
export const remove = async (id: string) => {
  return prisma.symptomRecord.delete({
    where: { id },
  });
};

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
  await prisma.symptomOnRecord.deleteMany({ where: { recordId } });

  for (const item of symptoms) {
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
