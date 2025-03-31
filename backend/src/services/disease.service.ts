// 🔹 disease.service.ts
// 이 파일은 '지병' 객체와 사용자의 객체 간의 관계를 개발적으로 처리하는 서비스 계층입니다.

import prisma from "../config/prisma.service";

/** 전체 지병 목록 조회 */
export const findAll = async () => {
  return await prisma.disease.findMany();
};

/** 특정 ID의 지병 검색 */
export const findById = async (id: string) => {
  return await prisma.disease.findUnique({ where: { id } });
};

/** userId를 기반으로 사용자의 지병 목록 조회 */
export const findByUserId = async (userId: string) => {
  const userDiseases = await prisma.userDisease.findMany({
    where: { userId },
    include: {
      disease: true, // ✅ 지병 정보 포함해서 반환
    },
  });

  return userDiseases.map((ud) => ud.disease);
};

/** 사용자에게 지병 추가 */
export const addDiseaseToUser = async (userId: string, diseaseId: string) => {
  const exists = await prisma.userDisease.findUnique({
    where: {
      userId_diseaseId: { userId, diseaseId }, // 복합 unique index
    },
  });

  if (exists) {
    return { message: "Already added" };
  }

  return await prisma.userDisease.create({
    data: {
      userId,
      diseaseId,
    },
  });
};

/** 사용자의 지병 삭제 */
export const removeDiseaseFromUser = async (userId: string, diseaseId: string) => {
  try {
    return await prisma.userDisease.delete({
      where: {
        userId_diseaseId: { userId, diseaseId },
      },
    });
  } catch (err) {
    return { message: "Not found" };
  }
};
