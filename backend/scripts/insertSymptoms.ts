import fs from "fs";
import path from "path";
import prisma from "../src/config/prisma.service";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function insertSymptoms() {
  try {
    const filePath = path.resolve(__dirname, "../data/symptoms.json");
    const symptomList = JSON.parse(fs.readFileSync(filePath, "utf-8")) as { name: string; category: string }[];

    for (const symptom of symptomList) {
      await prisma.symptom.upsert({
        where: { name: symptom.name },
        update: { category: symptom.category },
        create: symptom,
      });
    }

    console.log("✅ 모든 증상이 DB에 성공적으로 저장되었습니다.");
  } catch (error) {
    console.error("❌ 증상 저장 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertSymptoms();
