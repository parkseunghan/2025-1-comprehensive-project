// 🔹 seed.ts
// Prisma를 통해 초기 더미 데이터를 삽입하는 스크립트입니다.

import prisma from "../src/config/prisma.service";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
    console.log("🌱 Seeding database...");

    // 1. 사용자 생성
    const user = await prisma.user.create({
        data: {
            id: "user-001",
            email: "test@example.com",
            password: "1234",
            name: "홍길동",
            gender: "남성",
            age: 30,
            height: 175.5,
            weight: 68.2,
            bmi: 20.2
        },
    });

    // 2. 질병 다수 등록
    await prisma.disease.createMany({
        data: [
            { id: "disease-001", name: "급성 기관지염" },
            { id: "disease-002", name: "폐렴" },
            { id: "disease-003", name: "위염" },
            { id: "disease-004", name: "소화성 궤양" },
            { id: "disease-005", name: "급성 장염" },
            { id: "disease-006", name: "간염" },
            { id: "disease-007", name: "과민성 대장증후군" },
            { id: "disease-008", name: "요로감염" },
            { id: "disease-009", name: "위식도역류질환(GERD)" },
            { id: "disease-010", name: "빈혈" },
            { id: "disease-011", name: "췌장염" },
            { id: "disease-012", name: "협심증" },
            { id: "disease-013", name: "심부전" },
            { id: "disease-014", name: "천식" },
            { id: "disease-015", name: "만성 폐쇄성 폐질환(COPD)" },
            { id: "disease-016", name: "급성 비인두염 (코감기)" },
            { id: "disease-017", name: "급성 인두염 (목감기)" },
            { id: "disease-018", name: "상기도 감염 (전신감기)" },
        ],
    });

    await prisma.medication.createMany({
        data: [
            { id: "med-001", name: "아스피린" },
            { id: "med-002", name: "타이레놀" },
            { id: "med-003", name: "이부프로펜" },
            { id: "med-004", name: "시프로플록사신" },
            { id: "med-005", name: "로사르탄" },
            { id: "med-006", name: "에스오메프라졸" },
            { id: "med-007", name: "메트포르민" },
            { id: "med-008", name: "리시노프릴" },
            { id: "med-009", name: "암로디핀" },
            { id: "med-010", name: "플루옥세틴" },
        ],
    });

    // 3. 사용자-지병 연결
    await prisma.userDisease.createMany({
        data: [
            { id: "user-disease-001", userId: user.id, diseaseId: "disease-001" },
            { id: "user-disease-002", userId: user.id, diseaseId: "disease-005" },
            { id: "user-disease-003", userId: user.id, diseaseId: "disease-009" },
        ],
    });

    // 3-1. 사용자-약물 연결
    await prisma.userMedication.createMany({
        data: [
            { id: "user-med-001", userId: user.id, medicationId: "med-001" },
            { id: "user-med-002", userId: user.id, medicationId: "med-002" },
        ],
    });

    // 4. 증상 등록
    await prisma.symptom.createMany({
        data: [
            { id: "symptom-001", name: "두통" },
            { id: "symptom-002", name: "기침" },
            { id: "symptom-003", name: "발열" },
        ],
    });

    // 5. 증상 기록 생성
    const record = await prisma.symptomRecord.create({
        data: {
            id: "record-001",
            userId: user.id,
            createdAt: new Date("2025-03-30T10:00:00Z"),
        },
    });

    // 6. 증상 기록 ↔ 증상 연결
    await prisma.symptomOnRecord.createMany({
        data: [
            { id: "sor-001", recordId: record.id, symptomId: "symptom-001", timeOfDay: "morning" }, // 두통
            { id: "sor-002", recordId: record.id, symptomId: "symptom-002", timeOfDay: "night" },   // 기침
            { id: "sor-003", recordId: record.id, symptomId: "symptom-003", timeOfDay: null },      // 발열
        ],
    });


    // 7. 예측 생성
    // 🔹 7. 예측 생성 (업데이트된 구조)
    await prisma.prediction.create({
        data: {
            id: "prediction-001",
            recordId: record.id,

            // coarse/fine 예측 관련
            coarseLabel: "감기",
            riskScore: 3.2,
            riskLevel: "보통",

            // 상위 예측 질병
            top1: "급성 비인두염",
            top1Prob: 0.6212,
            top2: "급성 인두염",
            top2Prob: 0.2211,
            top3: "상기도 감염",
            top3Prob: 0.1034,

            // 가이드 및 시간
            guideline: "전문가 상담을 권장합니다.",
            elapsedSec: 1.47,

            createdAt: new Date("2025-03-30T10:05:00Z"),
        },
    });


    console.log("✅ Seed completed.");
}

main()
    .catch((err) => {
        console.error("❌ Seed error:", err);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
