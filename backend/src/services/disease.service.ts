// 🔹 disease.service.ts
// 이 파일은 '지병(Disease)' 객체 및 사용자와의 관계를 처리하는 서비스 계층입니다.

import prisma from "../config/prisma.service";

/**
 * 전체 질병 목록 조회
 */
export const getAllDiseases = async () => {
  return await prisma.disease.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

/**
 * 질병 이름(name) 기준으로 단일 질병 조회
 */
export const findByName = async (name: string) => {
  return await prisma.disease.findUnique({
    where: { name },
  });
};

/**
 * 질병 코드(sickCode) 기준으로 단일 질병 조회
 */
export const findBySickCode = async (sickCode: string) => {
  return await prisma.disease.findUnique({
    where: { sickCode },
  });
};

/**
 * 사용자 ID 기준으로 사용자 지병 목록 조회
 */
export const findByUserId = async (userId: string) => {
  const userDiseases = await prisma.userDisease.findMany({
    where: { userId },
    include: {
      disease: true, // 지병 정보 포함
    },
  });

  return userDiseases.map((ud) => ud.disease);
};

/**
 * 사용자에게 지병 추가
 */
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

/**
 * 사용자 지병 삭제
 */
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
