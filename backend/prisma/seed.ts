// 📄 backend/prisma/seed.ts
// disease_descriptions.json 기반으로 DB에 upsert 방식으로 초기 데이터 삽입

import prisma from "../src/config/prisma.service";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

type DiseaseMap = {
  [code: string]: {
    name: string;
    description: string;
    tips: string;
  };
};

async function main() {
  console.log("🌱 Seeding database...");

  // 1. 사용자 생성
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      id: "user-001",
      email: "test@example.com",
      password: "1234",
      name: "홍길동",
      gender: "남성",
      age: 30,
      height: 175.5,
      weight: 68.2,
      bmi: 20.2,
    },
  });

  // 2. disease_descriptions.json 로드
  const filePath = path.join(__dirname, "disease_descriptions.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as DiseaseMap;

  // 3. 질병 데이터 upsert
  for (const [sickCode, val] of Object.entries(data)) {
    if (!sickCode || !val.name) continue;

    await prisma.disease.upsert({
      where: { sickCode },
      update: {
        name: val.name,
        description: val.description,
        tips: val.tips,
      },
      create: {
        sickCode,
        name: val.name,
        description: val.description,
        tips: val.tips,
      },
    });
  }

  // 4. 약물 데이터
  await prisma.medication.createMany({
    data: [
      {
        id: "med-001",
        name: "아스피린",
        itemSeq: "200003092",
        entpName: "한미약품(주)",
        efcy: "혈전 생성 억제",
        useMethod: "1일 1회, 식전에 복용",
        atpnWarn: "정기적 음주자 주의",
        atpn: "임신 3기 여성 금지",
        intrc: "이부프로펜 등과 병용 시 출혈 증가",
        se: "위장 출혈, 알레르기",
        depositMethod: "실온 보관",
        openDate: "20200901",
        updateDate: "20200905",
        imageUrl: "https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/147426411393800107",
      },
      {
        id: "med-002",
        name: "타이레놀",
        itemSeq: "200004321",
        entpName: "존슨앤드존슨",
        efcy: "해열, 진통",
        useMethod: "1회 1~2정, 1일 3~4회",
        atpnWarn: "간 질환자 주의",
        atpn: "해열진통제 병용 금지",
        intrc: "술과 병용 시 간손상 위험",
        se: "간손상, 피부발진",
        depositMethod: "건조한 곳",
        openDate: "20200810",
        updateDate: "20210101",
        imageUrl: "https://example.com/images/tylenol.png",
      },
    ],
    skipDuplicates: true,
  });

  // 5. 사용자 ↔ 지병 연결
  await prisma.userDisease.createMany({
    data: [
      { id: "user-disease-001", userId: user.id, diseaseId: "E00" },
      { id: "user-disease-002", userId: user.id, diseaseId: "E05" },
      { id: "user-disease-003", userId: user.id, diseaseId: "E10" },
    ],
    skipDuplicates: true,
  });

  // 6. 사용자 ↔ 약물 연결
  await prisma.userMedication.createMany({
    data: [
      { id: "user-med-001", userId: user.id, medicationId: "med-001" },
      { id: "user-med-002", userId: user.id, medicationId: "med-002" },
    ],
    skipDuplicates: true,
  });

  // 7. 증상 데이터
  await prisma.symptom.createMany({
    data: [
      { id: "symptom-001", name: "두통" },
      { id: "symptom-002", name: "기침" },
      { id: "symptom-003", name: "발열" },
    ],
    skipDuplicates: true,
  });

  // 8. 증상 기록
  const record = await prisma.symptomRecord.create({
    data: {
      id: "record-001",
      userId: user.id,
      createdAt: new Date("2025-03-30T10:00:00Z"),
    },
  });

  // 9. 증상 ↔ 기록 연결
  await prisma.symptomOnRecord.createMany({
    data: [
      { id: "sor-001", recordId: record.id, symptomId: "symptom-001", timeOfDay: "morning" },
      { id: "sor-002", recordId: record.id, symptomId: "symptom-002", timeOfDay: "night" },
      { id: "sor-003", recordId: record.id, symptomId: "symptom-003", timeOfDay: null },
    ],
    skipDuplicates: true,
  });

  // 10. 예측 결과 저장
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
  .finally(() => {
    prisma.$disconnect();
  });
