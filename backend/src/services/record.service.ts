// 📄 record.service.ts
// 예측 결과와 증상 + 시간 정보를 Prisma를 통해 DB에 저장하는 서비스

import prisma from "../config/prisma.service";

interface PredictionResult {
  coarseLabel: string;
  fineLabel: string;
  riskScore: number;
  riskLevel: string;
  guideline: string;
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
 * 위험 점수(riskScore)를 기반으로 위험도 등급(riskLevel)을 계산합니다.
 * @param riskScore 위험 점수 (0.0 ~ 1.0 사이 값)
 * @returns 위험도 등급 ("낮음", "보통", "높음", "응급")
 */
export function calculateRiskLevel(riskScore: number): string {
  if (riskScore >= 0.8) return "응급";
  if (riskScore >= 0.6) return "높음";
  if (riskScore >= 0.4) return "보통";
  return "낮음";
}
/**
 * 위험도 등급에 따라 기본 대응 가이드를 생성합니다.
 */
function generateGuideline(riskLevel: string): string {
  if (riskLevel === "응급") return "즉시 응급실 방문이 필요합니다.";
  if (riskLevel === "높음") return "가까운 병원 방문을 권장합니다.";
  if (riskLevel === "보통") return "증상을 경과 관찰하고 심화 시 병원을 방문하세요.";
  return "생활 관리를 통해 주의하세요.";
}

/**
 * 예측 결과 저장
 */
export const savePredictionResult = async (
  recordId: string,
  top1: { coarseLabel: string; fineLabel: string; riskScore: number; riskLevel: string; guideline: string },
  top2?: { coarseLabel: string; fineLabel: string; riskScore: number; riskLevel: string; guideline: string },
  top3?: { coarseLabel: string; fineLabel: string; riskScore: number; riskLevel: string; guideline: string }
) => {
  await prisma.prediction.create({
    data: {
      recordId,
      coarseLabel: top1.coarseLabel,
      fineLabel: top1.fineLabel,
      riskScore: top1.riskScore,
      riskLevel: top1.riskLevel,
      guideline: top1.guideline,
      top1: top1.fineLabel,
      top1Prob: top1.riskScore,
      top2: top2?.fineLabel ?? null,
      top2Prob: top2?.riskScore ?? null,
      top3: top3?.fineLabel ?? null,
      top3Prob: top3?.riskScore ?? null,
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
