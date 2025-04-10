// 🔹 user.service.ts
// 사용자 관련 비즈니스 로직을 처리하는 서비스 계층 (Prisma 버전)

import prisma from "../config/prisma.service";

/**
 * 사용자 ID로 전체 정보 조회 (지병 + 증상기록 + 예측 포함)
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

  // 비밀번호 제외 + 관계 필드 정리
  const { password, ...safeUser } = user;

  return {
    ...safeUser,
    diseases: user.diseases.map((ud) => ud.disease), // Disease[] 형태로 평탄화
    records: user.records.map((r) => ({
      ...r,
      symptoms: r.symptoms.map((s) => s.symptom), // Symptom[] 평탄화
    })),
  };
};

/**
 * 사용자 정보 업데이트 (기본 필드 + 지병)
 */
export const update = async (id: string, data: any) => {
  const { diseases, ...rest } = data;

  return prisma.user.update({
    where: { id },
    data: {
      ...rest, // gender, age, height, weight, medications 등
      diseases: {
        deleteMany: {}, // 기존 지병 제거
        create: diseases?.map((name: string) => ({
          disease: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
    include: {
      diseases: { include: { disease: true } },
    },
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
