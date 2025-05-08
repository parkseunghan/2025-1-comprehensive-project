// 📄 scripts/insertDiseases.ts

import fs from "fs";
import path from "path";
import prisma from "../src/config/prisma.service";

const DATA_PATH = path.resolve(__dirname, "../data/diseases.json");

async function insertDiseases() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    const mapped = data.map((item: any) => ({
      sickCode: item.code,
      name: item.name,
      englishName: item.englishName || null,
      description: null,
      tips: null,
    }));

    await prisma.disease.createMany({
      data: mapped,
      skipDuplicates: true, // 동일 ID(sickCode) 중복 삽입 방지
    });

    console.log(`✅ ${mapped.length}건의 질병 정보를 DB에 저장했습니다.`);
  } catch (error) {
    console.error("❌ 삽입 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertDiseases();
