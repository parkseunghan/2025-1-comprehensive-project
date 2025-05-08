import prisma from "../config/prisma.service";
import { PredictionCandidate } from "@/types/prediction.types";

/**
 * 🔹 진단 기록 생성
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
          timeOfDay: null,
        },
      });
    }
  }

  return record;
};

/**
 * 🔹 사용자별 진단 기록 조회
 */
export const findByUserId = async (userId: string) => {
  return prisma.symptomRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      prediction: {
        include: { ranks: true },
      },
      symptoms: {
        include: { symptom: true },
      },
    },
  });
};

/**
 * 🔹 특정 진단 기록 상세 조회
 */
export const findById = async (id: string) => {
  return prisma.symptomRecord.findUnique({
    where: { id },
    include: {
      prediction: {
        include: { ranks: true },
      },
      symptoms: {
        include: { symptom: true },
      },
    },
  });
};

/**
 * 🔹 진단 기록 삭제
 */
export const remove = async (id: string) => {
  return prisma.symptomRecord.delete({ where: { id } });
};

/**
 * 🔹 응급 진단명 리스트 (이것들만 "응급" 허용)
 */
const EMERGENCY_DISEASES = ["심근경색", "뇌출혈", "급성 폐렴"];

/**
 * 🔹 위험 점수 → 위험 등급
 */
function calculateRiskLevel(score: number, fineLabel: string): string {
  if (score >= 6.0 && EMERGENCY_DISEASES.includes(fineLabel)) return "응급";
  if (score >= 4.5) return "높음";
  if (score >= 2.5) return "보통";
  return "낮음";
}

/**
 * 🔹 위험 등급 → 가이드라인 텍스트
 */
function generateGuideline(riskLevel: string): string {
  if (riskLevel === "응급") return "즉시 응급실 방문이 필요합니다.";
  if (riskLevel === "높음") return "가까운 병원 방문을 권장합니다.";
  if (riskLevel === "보통") return "증상을 경과 관찰하고 심화 시 병원을 방문하세요.";
  return "생활 관리를 통해 주의하세요.";
}

/**
 * 🔹 위험도 계산 (P(D) × [가중합])
 */
function calculateRiskScore({
  predictionProb,
  symptomWeight,
  chronicWeight,
  ageWeight,
  genderWeight,
  bmiWeight,
  medicationWeight,
}: {
  predictionProb: number;
  symptomWeight: number;
  chronicWeight: number;
  ageWeight: number;
  genderWeight: number;
  bmiWeight: number;
  medicationWeight: number;
}): number {
  const W1 = 1.0, W2 = 1.0, W3 = 1.0, W4 = 1.0, W5 = 1.0, W6 = 1.0;

  const riskScore =
    predictionProb *
    (W1 * symptomWeight +
      W2 * chronicWeight +
      W3 * ageWeight +
      W4 * genderWeight +
      W5 * bmiWeight +
      W6 * medicationWeight);

  return Number(riskScore.toFixed(2));
}

/**
 * 🔹 예측 결과 저장 (Prediction + PredictionRank)
 */
export const savePredictionResult = async (
  recordId: string,
  predictions: PredictionCandidate[],
  elapsedSec?: number
) => {
  const top1 = predictions[0];

  // ✅ 실제 사용자 데이터 기반으로 추후 대입 예정
  const riskScore = calculateRiskScore({
    predictionProb: top1.riskScore, // top1.riskScore는 예측 확률
    symptomWeight: 0.9,
    chronicWeight: 1.2,
    ageWeight: 1.1,
    genderWeight: 1.0,
    bmiWeight: 1.3,
    medicationWeight: 1.1,
  });

  const riskLevel = top1.riskLevel ?? calculateRiskLevel(riskScore, top1.fineLabel);
  const guideline = top1.guideline ?? generateGuideline(riskLevel);

  // ✅ 디버깅 로그로 확인
  console.log("🧠 위험도 계산", {
    fineLabel: top1.fineLabel,
    riskScore,
    riskLevel,
    isEmergency: EMERGENCY_DISEASES.includes(top1.fineLabel),
  });

  const prediction = await prisma.prediction.create({
    data: {
      recordId,
      coarseLabel: top1.coarseLabel,
      fineLabel: top1.fineLabel,
      riskScore,
      riskLevel,
      guideline,
      elapsedSec: elapsedSec ?? null,
    },
  });

  const ranks = predictions.map((item, index) => ({
    predictionId: prediction.id,
    rank: index + 1,
    coarseLabel: item.coarseLabel,
    fineLabel: item.fineLabel,
    riskScore: item.riskScore, // raw 확률 그대로 저장
  }));

  await prisma.predictionRank.createMany({
    data: ranks,
    skipDuplicates: true,
  });

  return prediction;
};

/**
 * 🔹 증상 + 시간대 저장
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
