// 📄 user.service.ts

import prisma from "../config/prisma.service";
import { UserUpdateInput } from "../schemas/user.schema";

// ✅ BMI 계산 유틸
const calculateBMI = (weight: number, height: number): number => {
    const h = height / 100;
    return +(weight / (h * h)).toFixed(2);
};

// ✅ 사용자 조회 (지병, 약물, 기록 포함)
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
            prediction: r.prediction ?? null,
        })),
    };
};

// ✅ 사용자 정보 업데이트 (지병/약물 포함)
export const update = async (id: string, data: UserUpdateInput) => {
    const { diseases, medications, ...rest } = data;

    if (!rest.gender || rest.age === undefined || rest.height === undefined || rest.weight === undefined) {
        throw new Error("필수 프로필 항목이 누락되었습니다.");
    }

    // 🔍 유효한 지병 ID 확인
    const validDiseases = await prisma.disease.findMany({
        where: { id: { in: diseases ?? [] } },
    });
    const invalidDiseases = diseases?.filter((id) => !validDiseases.some((d) => d.id === id));
    if (invalidDiseases?.length) {
        throw new Error(`유효하지 않은 지병이 포함되어 있습니다: ${invalidDiseases.join(", ")}`);
    }

    // 🔍 유효한 약물 ID 확인
    const validMedications = await prisma.medication.findMany({
        where: { id: { in: medications ?? [] } },
    });
    const invalidMedications = medications?.filter((id) => !validMedications.some((m) => m.id === id));
    if (invalidMedications?.length) {
        throw new Error(`유효하지 않은 약물이 포함되어 있습니다: ${invalidMedications.join(", ")}`);
    }

    // ✅ 업데이트
    await prisma.user.update({
        where: { id },
        data: {
            ...rest,
            bmi: calculateBMI(rest.weight, rest.height),
            diseases: diseases
                ? diseases.length > 0
                    ? {
                        deleteMany: {},
                        create: validDiseases.map((d) => ({
                            disease: { connect: { id: d.id } },
                        })),
                    }
                    : { deleteMany: {} }
                : undefined,
            medications: medications
                ? medications.length > 0
                    ? {
                        deleteMany: {},
                        create: validMedications.map((m) => ({
                            medication: { connect: { id: m.id } },
                        })),
                    }
                    : { deleteMany: {} }
                : undefined,
        },
    });

    return await findById(id);
};

// ✅ 사용자 삭제
export const remove = async (id: string) => {
    return prisma.user.delete({ where: { id } });
};
