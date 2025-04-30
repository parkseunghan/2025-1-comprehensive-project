// 📄 record.service.ts
// 예측 결과와 증상 + 시간 정보를 Prisma를 통해 DB에 저장하는 서비스 (PredictionRank 구조 적용)

import prisma from "../config/prisma.service";
import { PredictionCandidate } from "@/types/prediction.types";

/**
 * 🔹 진단 기록 생성 (기본 증상 ID 리스트 기반)
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
 * 🔹 사용자별 진단 기록 전체 조회
 */
export const findByUserId = async (userId: string) => {
  return prisma.symptomRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      prediction: {
        include: {
          ranks: true,
        },
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
        include: {
          ranks: true,
        },
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
  return prisma.symptomRecord.delete({
    where: { id },
  });
};

/**
 * 🔹 위험 점수 → 위험 등급 변환 유틸
 */
export function calculateRiskLevel(riskScore: number): string {
  if (riskScore >= 0.8) return "응급";
  if (riskScore >= 0.6) return "높음";
  if (riskScore >= 0.4) return "보통";
  return "낮음";
}

/**
 * 🔹 위험 등급 → 대응 가이드라인 생성
 */
function generateGuideline(riskLevel: string): string {
  if (riskLevel === "응급") return "즉시 응급실 방문이 필요합니다.";
  if (riskLevel === "높음") return "가까운 병원 방문을 권장합니다.";
  if (riskLevel === "보통") return "증상을 경과 관찰하고 심화 시 병원을 방문하세요.";
  return "생활 관리를 통해 주의하세요.";
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

  // Prediction 생성 (Top-1 기준)
  const prediction = await prisma.prediction.create({
    data: {
      recordId,
      coarseLabel: top1.coarseLabel,
      fineLabel: top1.fineLabel,
      riskScore: top1.riskScore,
      riskLevel: top1.riskLevel,
      guideline: top1.guideline,
      elapsedSec,
    },
  });

  // PredictionRank 생성 (Top-N 모두 저장)
  const ranks = predictions.map((item, index) => ({
    predictionId: prediction.id,
    rank: index + 1,
    coarseLabel: item.coarseLabel,
    fineLabel: item.fineLabel,
    riskScore: item.riskScore,
  }));

  await prisma.predictionRank.createMany({
    data: ranks,
    skipDuplicates: true,
  });

  return prediction;
};

/**
 * 🔹 증상 + 시간대 정보 저장
 */
export const saveSymptomsToRecord = async (
  recordId: string,
  symptoms: { symptom: string; time: string | null }[]
) => {
  // 기존 연결 삭제 후 다시 추가 (완전 덮어쓰기 방식)
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
