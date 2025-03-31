// 🔹 prediction.service.ts
// 이 파일은 예측(Prediction) 관련 비즈니스 로직을 담당하는 서비스 계층입니다.
// Prisma를 통해 증상 기록 기반 예측 생성 및 조회를 처리합니다.

import prisma from "../config/prisma.service";

/** 예측 생성 (더미 결과 기반) */
export const create = async (recordId: string) => {
  // 이미 예측된 기록인지 확인
  const existing = await prisma.prediction.findUnique({
    where: { recordId },
  });

  if (existing) return { message: "이미 예측이 생성되었습니다." };

  // 예측 생성
  return await prisma.prediction.create({
    data: {
      recordId,
      result: "감기", // ✅ 더미 데이터
      confidence: 0.91,
      guideline: "수분 섭취와 휴식을 충분히 취하세요.",
    },
  });
};

/** 예측 삭제 */
export const remove = async (recordId: string) => {
  try {
    return await prisma.prediction.delete({ where: { recordId } });
  } catch (err) {
    return null;
  }
};

/** 증상 기록 ID로 예측 결과 조회 */
export const findByRecordId = async (recordId: string) => {
  return await prisma.prediction.findUnique({
    where: { recordId },
  });
};