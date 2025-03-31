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
            medications: ["아스피린", "타이레놀"],
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

    // 3. 사용자와 지병 연결 (여러 개)
    await prisma.userDisease.createMany({
        data: [
            { id: "user-disease-001", userId: user.id, diseaseId: "disease-001" },
            { id: "user-disease-002", userId: user.id, diseaseId: "disease-005" },
            { id: "user-disease-003", userId: user.id, diseaseId: "disease-009" },
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

    // 6. 증상 기록 ↔ 증상 다대다 연결
    await prisma.symptomOnRecord.createMany({
        data: [
            { id: "sor-001", recordId: record.id, symptomId: "symptom-001" },
            { id: "sor-002", recordId: record.id, symptomId: "symptom-002" },
            { id: "sor-003", recordId: record.id, symptomId: "symptom-003" },
        ],
    });

    // 7. 예측 생성
    await prisma.prediction.create({
        data: {
            id: "prediction-001",
            recordId: record.id,
            result: "감기",
            confidence: 0.92,
            guideline: "충분한 휴식과 수분 섭취를 권장합니다.",
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
