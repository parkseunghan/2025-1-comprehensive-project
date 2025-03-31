// 🔹 record.service.ts
// 이 파일은 증상 기록(SymptomRecord) 관련 비즈니스 로직을 처리하는 서비스 계층입니다.

import prisma from "../config/prisma.service";

/** 증상 기록 생성 */
export const create = async (userId: string, symptomIds: string[]) => {
  const newRecord = await prisma.symptomRecord.create({
    data: {
      userId,
      symptoms: {
        create: symptomIds.map((symptomId) => ({
          symptomId,
        })),
      },
    },
    include: {
      symptoms: {
        include: {
          symptom: true,
        },
      },
    },
  });

  return newRecord;
};

/** 사용자 ID로 해당 사용자의 증상 기록 전체 조회 */
export const findByUserId = async (userId: string) => {
  return await prisma.symptomRecord.findMany({
    where: { userId },
    include: {
      symptoms: {
        include: {
          symptom: true,
        },
      },
      prediction: true,
    },
  });
};

/** 특정 증상 기록 ID로 조회 */
export const findById = async (id: string) => {
  return await prisma.symptomRecord.findUnique({
    where: { id },
    include: {
      symptoms: {
        include: {
          symptom: true,
        },
      },
      prediction: true,
    },
  });
};

/** 특정 증상 기록 삭제 */
export const remove = async (id: string) => {
  try {
    return await prisma.symptomRecord.delete({
      where: { id },
    });
  } catch {
    return null;
  }
};
