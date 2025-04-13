import prisma from "../config/prisma.service";
import { UserUpdateInput } from "../schemas/user.schema"; // zod 타입 정의

export const findById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            diseases: { include: { disease: true } },
            medications: { include: { medication: true } }, // ✅ 추가
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
        })),
    };
};

export const update = async (id: string, data: UserUpdateInput) => {
    const { diseases, medications, ...rest } = data;

    // 🔸 1. 질병/약물 존재 여부 확인
    const validDiseases = await prisma.disease.findMany({
        where: { name: { in: diseases ?? [] } },
    });
    const validMedications = await prisma.medication.findMany({
        where: { name: { in: medications ?? [] } },
    });

    // 🔸 2. 존재하지 않는 항목이 있다면 예외 처리
    if ((diseases?.length || 0) !== validDiseases.length) {
        throw new Error("유효하지 않은 지병이 포함되어 있습니다.");
    }
    if ((medications?.length || 0) !== validMedications.length) {
        throw new Error("유효하지 않은 약물이 포함되어 있습니다.");
    }

    // 🔸 3. 업데이트 수행
    return prisma.user.update({
        where: { id },
        data: {
            ...rest,
            diseases: {
                deleteMany: {},
                create: validDiseases.map((d) => ({
                    disease: { connect: { id: d.id } },
                })),
            },
            medications: {
                deleteMany: {},
                create: validMedications.map((m) => ({
                    medication: { connect: { id: m.id } },
                })),
            },
        },
        include: {
            diseases: { include: { disease: true } },
            medications: { include: { medication: true } },
        },
    });
};

export const remove = async (id: string) => {
    return prisma.user.delete({
        where: { id },
    });
};
