import fs from "fs";
import path from "path";
import prisma from "../src/config/prisma.service";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
  console.log("🌱 Seeding database...");

    // ✅ 비밀번호 해시
    const hashedPassword = await bcrypt.hash("1234", 10);

    // 1. 사용자 생성
    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        id: "user-001",
        email: "test@example.com",
        password: hashedPassword, // ✅ 해시된 비밀번호 사용
        name: "홍길동",
        gender: "남성",
        age: 30,
        height: 175.5,
        weight: 68.2,
        bmi: 20.2,
      },
    });

  // 2. 사용자 ↔ 지병 연결 (질병은 미리 삽입됨)
  await prisma.userDisease.createMany({
    data: [
      { id: "user-disease-001", userId: user.id, diseaseId: "E00" },
      { id: "user-disease-002", userId: user.id, diseaseId: "E05" },
      { id: "user-disease-003", userId: user.id, diseaseId: "E10" },
    ],
    skipDuplicates: true,
  });

  // 3. 사용자 ↔ 약물 연결
  await prisma.userMedication.createMany({
    data: [
      { id: "user-med-001", userId: user.id, medicationId: "med-195700020" },
      { id: "user-med-002", userId: user.id, medicationId: "med-195900034" },
    ],
    skipDuplicates: true,
  });

  // 4. 증상 등록 (symptoms.json 기반)
  const symptomFilePath = path.resolve(__dirname, "../data/symptoms.json");
  const symptomList = JSON.parse(fs.readFileSync(symptomFilePath, "utf-8")) as { name: string; category: string }[];

  const symptomData = symptomList.map((symptom, idx) => ({
    id: `symptom-${String(idx + 1).padStart(3, "0")}`,
    name: symptom.name,
    category: symptom.category,
  }));

  await prisma.symptom.createMany({
    data: symptomData,
    skipDuplicates: true,
  });

  // 5. 증상 기록 생성
  const record = await prisma.symptomRecord.create({
    data: {
      id: "record-001",
      userId: user.id,
      createdAt: new Date("2025-03-30T10:00:00Z"),
    },
  });

  // // 6. 증상 ↔ 기록 연결
  // await prisma.symptomOnRecord.createMany({
  //   data: [
  //     { id: "sor-001", recordId: record.id, symptomId: "symptom-020", timeOfDay: "morning" },
  //     { id: "sor-002", recordId: record.id, symptomId: "symptom-002", timeOfDay: "night" },
  //     { id: "sor-003", recordId: record.id, symptomId: "symptom-028", timeOfDay: null },
  //   ],
  //   skipDuplicates: true,
  // });

  // 7. 예측 결과 저장
  const prediction = await prisma.prediction.create({
    data: {
      id: "prediction-001",
      recordId: record.id,
      coarseLabel: "감기",
      fineLabel: "급성 비인두염",
      riskScore: 0.6212,
      riskLevel: "보통",
      guideline: "전문가 상담을 권장합니다.",
      elapsedSec: 1.47,
      createdAt: new Date("2025-03-30T10:05:00Z"),
    },
  });

  // 8. 예측 결과 Top-N 저장
  await prisma.predictionRank.createMany({
    data: [
      {
        id: "rank-001",
        predictionId: prediction.id,
        rank: 1,
        coarseLabel: "감기",
        fineLabel: "급성 비인두염",
        riskScore: 0.6212,
      },
      {
        id: "rank-002",
        predictionId: prediction.id,
        rank: 2,
        coarseLabel: "감기",
        fineLabel: "급성 인두염",
        riskScore: 0.2211,
      },
      {
        id: "rank-003",
        predictionId: prediction.id,
        rank: 3,
        coarseLabel: "감기",
        fineLabel: "상기도 감염",
        riskScore: 0.1034,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed.");
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
