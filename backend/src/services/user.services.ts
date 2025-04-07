// 🔹 user.service.ts
// 사용자 관련 비즈니스 로직을 처리하는 서비스 계층 (Prisma 버전)

import prisma from "../config/prisma.service";
/**
 * 사용자 ID로 전체 정보 조회 (지병 + 증상기록 + 증상 + 예측 포함)
 */
export const findById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      diseases: { include: { disease: true } },
      records: {
        include: {
          symptoms: { include: { symptom: true } },
          prediction: true,
        },
      },
    },
  });

  if (!user) return null;

  // password 제거
  const { password, ...safeUser } = user;

  return {
    ...safeUser,
    diseases: user.diseases.map((ud: { disease: any }) => ud.disease),
    records: user.records.map((r: { symptoms: { symptom: any }[] }) => ({
      ...r,
      symptoms: r.symptoms.map((s: { symptom: any }) => s.symptom),
    })),
  };
};


/**
 * 사용자 정보 업데이트
 */
export const update = async (id: string, data: any) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

/**
 * 사용자 삭제
 */
export const remove = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};