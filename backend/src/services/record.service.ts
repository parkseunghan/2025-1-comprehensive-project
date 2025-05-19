// 📄 src/services/record.service.ts
import prisma from "../config/prisma.service";
import { PredictionCandidate } from "@/types/prediction.types";

/**
 * 🔹 진단 기록 생성
 */
export const create = async (userId: string, symptomIds: string[]) => {
  const record = await prisma.symptomRecord.create({ data: { userId } });

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
      prediction: { include: { ranks: true } },
      symptoms: { include: { symptom: true } },
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
      prediction: { include: { ranks: true } },
      symptoms: { include: { symptom: true } },
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
 * 🔹 응급 진단명 리스트
 */
const EMERGENCY_DISEASES = ["심근경색", "뇌출혈", "급성 폐렴"];

/**
 * 🔹 위험 등급 → 가이드라인 텍스트
 */
function generateGuideline(riskLevel: string): string {
  if (riskLevel === "응급") return "심각한 증상이 의심됩니다. 즉시 119 또는 응급실로 이동하세요.";
  if (riskLevel === "높음") return "증상이 심각할 수 있습니다. 오늘 중 가까운 병원에 방문해 진료를 받으세요.";
  if (riskLevel === "보통") return "상태를 주의 깊게 관찰하세요. 증상이 1~2일 이상 지속되거나 심해지면 병원을 방문하세요.";
  return "증상이 가벼운 상태입니다. 수분 섭취, 휴식 등 생활 관리를 하며 경과를 지켜보세요.";
}

/**
 * 🔹 위험 점수 → 위험 등급
 */
function calculateRiskLevel(score: number, fineLabel: string): string {
  if (score >= 7.0 && EMERGENCY_DISEASES.includes(fineLabel)) return "응급";
  if (score >= 5.5) return "높음";
  if (score >= 3.5) return "보통";
  return "낮음";
}

/**
 * 🔹 개선된 위험도 계산 함수
 */
function calculateRiskScore({
  predictionProb,
  age,
  bmi,
  diseases,
  medications,
  symptoms,
}: {
  predictionProb: number;
  age: number;
  bmi: number;
  diseases: string[];
  medications: string[];
  symptoms: string[];
}): number {
  const ageWeight = age >= 65 ? 1.0 : age >= 40 ? 0.7 : 0.3;
  const bmiWeight = bmi >= 25 ? 1.0 : bmi < 18.5 ? 0.8 : 0.3;
  const chronicWeight = diseases.length > 0 ? 1.0 : 0.0;
  const medicationWeight = medications.length > 0 ? 1.0 : 0.0;
  const symptomWeight = symptoms.length >= 4 ? 1.0 : symptoms.length >= 2 ? 0.7 : 0.4;

  const isHealthy =
    chronicWeight === 0 &&
    medicationWeight === 0 &&
    ageWeight <= 0.3 &&
    bmiWeight <= 0.3;

  const healthyPenalty = isHealthy ? 0.6 : 1.0;

  const weightedSum =
    1.0 * symptomWeight +
    1.0 * chronicWeight +
    1.0 * ageWeight +
    1.0 * 1.0 + // genderWeight (중립)
    1.0 * bmiWeight +
    1.0 * medicationWeight;

  const rawScore = predictionProb * weightedSum * healthyPenalty;
  return Number(rawScore.toFixed(2));
}

/**
 * 🔹 예측 결과 저장
 */
export const savePredictionResult = async (
  recordId: string,
  predictions: PredictionCandidate[],
  user: {
    age: number;
    bmi: number;
    diseases: string[];
    medications: string[];
    gender: string;
  },
  symptoms: string[],
  elapsedSec?: number
) => {
  const top1 = predictions[0];

  const riskScore = calculateRiskScore({
    predictionProb: top1.riskScore,
    age: user.age,
    bmi: user.bmi,
    diseases: user.diseases,
    medications: user.medications,
    symptoms,
  });

  const riskLevel = top1.riskLevel ?? calculateRiskLevel(riskScore, top1.fineLabel);
  const guideline = top1.guideline ?? generateGuideline(riskLevel);

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
    riskScore: item.riskScore,
  }));

  await prisma.predictionRank.createMany({ data: ranks, skipDuplicates: true });
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
    const symptom = await prisma.symptom.findUnique({ where: { name: item.symptom } });
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
