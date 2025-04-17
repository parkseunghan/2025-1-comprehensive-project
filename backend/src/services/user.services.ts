// 🔹 user.service.ts
// 사용자 관련 비즈니스 로직을 처리하는 서비스 계층 (Prisma + Zod 기반)

import prisma from "../config/prisma.service";
import { UserUpdateInput } from "../schemas/user.schema"; // zod 기반 타입 추론

// ✅ BMI 계산 유틸 함수
const calculateBMI = (weight: number, height: number): number => {
    const h = height / 100;
    return +(weight / (h * h)).toFixed(2);
  };

/**
 * 사용자 ID로 전체 정보 조회 (지병 + 약물 + 증상 기록 + 예측 포함)
 */
export const findById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            diseases: { include: { disease: true } },
            medications: { include: { medication: true } },
            records: {
                include: {
                    symptoms: { include: { symptom: true } },
                    prediction: true,
                },
            },
        },
    });

    if (!user) return null;

    const { password, ...safeUser } = user;

    return {
        ...safeUser,
        diseases: user.diseases.map((ud) => ud.disease),
        medications: user.medications.map((um) => um.medication),
        records: user.records.map((r) => ({
            ...r,
            symptoms: r.symptoms.map((s) => s.symptom),
            prediction: r.prediction ?? null, // ✅ null 대응
        })),
    };
};

/**
 * 사용자 정보 업데이트 (성별/나이/키/몸무게 + 지병 + 약물)
 */
export const update = async (id: string, data: UserUpdateInput) => {
    const { diseases, medications, ...rest } = data;

    // ✅ 필수 필드 누락 방지
    if (
        !rest.gender ||
        rest.age === undefined ||
        rest.height === undefined ||
        rest.weight === undefined
    ) {
        throw new Error("필수 프로필 항목이 누락되었습니다.");
    }

    // ✅ 유효한 지병 목록 확인
    const validDiseases = await prisma.disease.findMany({
        where: { name: { in: diseases ?? [] } },
    });

    const invalidDiseases = diseases?.filter(
        (name) => !validDiseases.some((d) => d.name === name)
    );
    if (invalidDiseases?.length) {
        throw new Error(
            `유효하지 않은 지병이 포함되어 있습니다: ${invalidDiseases.join(", ")}`
        );
    }

    // ✅ 유효한 약물 목록 확인
    const validMedications = await prisma.medication.findMany({
        where: { name: { in: medications ?? [] } },
    });

    const invalidMedications = medications?.filter(
        (name) => !validMedications.some((m) => m.name === name)
    );
    if (invalidMedications?.length) {
        throw new Error(
            `유효하지 않은 약물이 포함되어 있습니다: ${invalidMedications.join(", ")}`
        );
    }

    // ✅ 사용자 정보 업데이트
    return prisma.user.update({
        where: { id },
        data: {
            ...rest,
            bmi: calculateBMI(rest.weight, rest.height), // ✅ BMI 자동 계산 저장

            // ✅ 선택 시에만 업데이트
            diseases: diseases
                ? {
                    deleteMany: {},
                    create: validDiseases.map((d) => ({
                        disease: { connect: { id: d.id } },
                    })),
                }
                : undefined,

            medications: medications
                ? {
                    deleteMany: {},
                    create: validMedications.map((m) => ({
                        medication: { connect: { id: m.id } },
                    })),
                }
                : undefined,
        },
        include: {
            diseases: { include: { disease: true } },
            medications: { include: { medication: true } },
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
