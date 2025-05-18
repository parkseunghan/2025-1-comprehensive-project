// 📄 scripts/insertDiseases.ts

import fs from "fs";
import path from "path";
import prisma from "../src/config/prisma.service";

// 🔹 파일 경로 설정
const DATA_PATH = path.resolve(__dirname, "../data/diseases_copy.json");

// 🔹 sickCode → category 분류 함수
function getCategoryFromSickCode(code: string): string {
  if (!code) return "기타";
  if (code.startsWith("E")) return "내분비계";
  if (code.startsWith("I")) return "순환기계";
  if (code.startsWith("J")) return "호흡기계";
  if (code.startsWith("K")) return "소화기계";
  if (code.startsWith("N")) return "비뇨기계";
  if (code.startsWith("D")) return "혈액/면역계";
  return "기타";
}

async function insertDiseases() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    const mapped = data.map((item: any) => ({
      sickCode: item.code,
      name: item.name,
      englishName: item.englishName || null,
      description: item.description || null,
      tips: item.tips || null,
      category: getCategoryFromSickCode(item.code), // ✅ 추가
    }));

    await prisma.disease.createMany({
      data: mapped,
      skipDuplicates: true,
    });

    console.log(`✅ ${mapped.length}건의 질병 정보를 DB에 저장했습니다.`);
  } catch (error) {
    console.error("❌ 삽입 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertDiseases();
