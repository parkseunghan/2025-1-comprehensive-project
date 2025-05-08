// 📄 scripts/insertSymptoms.ts

import fs from "fs";
import path from "path";
import prisma from "../src/config/prisma.service";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function insertSymptoms() {
  try {
    const filePath = path.resolve(__dirname, "../data/symptoms.json");
    const symptomList = JSON.parse(fs.readFileSync(filePath, "utf-8")) as string[];

    const data = symptomList.map((name, idx) => ({
      id: `symptom-${String(idx + 1).padStart(3, "0")}`,
      name,
    }));

    await prisma.symptom.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`✅ 총 ${data.length}개의 증상 데이터가 저장되었습니다.`);
  } catch (error) {
    console.error("❌ 증상 삽입 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertSymptoms();
