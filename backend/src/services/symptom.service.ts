// 🔹 symptom.service.ts
// 이 파일은 '증상(Symptom)' 데이터를 더미 기반으로 조회하는 서비스 계층입니다.
// 전체 목록과 특정 ID로 검색하는 기능을 제공합니다.

import prisma from "../config/prisma.service";

/**
 * 전체 증상 목록을 반환합니다.
 */
export const findAll = async () => {
  return await prisma.symptom.findMany();
};

/**
 * 특정 ID에 해당하는 증상을 반환합니다.
 * @param id 증상 ID
 */
export const findById = async (id: string) => {
  return await prisma.symptom.findUnique({
    where: { id },
  });
};
