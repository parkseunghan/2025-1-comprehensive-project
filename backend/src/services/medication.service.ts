// 🔹 medication.service.ts
// 이 파일은 '약물(Medication)' 관련 데이터 처리 및 사용자와의 관계를 다루는 서비스 계층입니다.

import prisma from "../config/prisma.service";

/** 전체 약물 목록 조회 */
export const findAll = async () => {
  return await prisma.medication.findMany();
};

/** 특정 ID의 약물 검색 */
export const findById = async (id: string) => {
  return await prisma.medication.findUnique({ where: { id } });
};

/** userId를 기반으로 사용자의 약물 목록 조회 */
export const findByUserId = async (userId: string) => {
  const userMedications = await prisma.userMedication.findMany({
    where: { userId },
    include: {
      medication: true, // ✅ 약물 정보 포함해서 반환
    },
  });

  return userMedications.map((um: { medication: any }) => um.medication);
};

/** 사용자에게 약물 추가 */
export const addMedicationToUser = async (userId: string, medicationId: string) => {
  const exists = await prisma.userMedication.findUnique({
    where: {
      userId_medicationId: { userId, medicationId }, // 복합 unique index
    },
  });

  if (exists) {
    return { message: "Already added" };
  }

  return await prisma.userMedication.create({
    data: {
      userId,
      medicationId,
    },
  });
};

/** 사용자의 약물 삭제 */
export const removeMedicationFromUser = async (userId: string, medicationId: string) => {
  try {
    return await prisma.userMedication.delete({
      where: {
        userId_medicationId: { userId, medicationId },
      },
    });
  } catch (err) {
    return { message: "Not found" };
  }
};
