// 📄 scripts/insertMedications.ts

import fs from "fs";
import path from "path";
import prisma from "../src/config/prisma.service";

const DATA_PATH = path.resolve(__dirname, "../data/medications.json");

async function insertMedications() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

    const mapped = data.map((item: any) => ({
      id: `med-${item.itemSeq}`, // ✅ 항상 명시적으로 지정
      name: item.itemName,
      itemSeq: item.itemSeq,
      entpName: item.entpName || null,
      efcy: item.efcyQesitm || null,
      useMethod: item.useMethodQesitm || null,
      atpnWarn: item.atpnWarnQesitm || null,
      atpn: item.atpnQesitm || null,
      intrc: item.intrcQesitm || null,
      se: item.seQesitm || null,
      depositMethod: item.depositMethodQesitm || null,
      openDate: item.openDe || null,
      updateDate: item.updateDe || null,
      imageUrl: item.itemImage || null,
    }));

    await prisma.medication.createMany({
      data: mapped,
      skipDuplicates: true,
    });

    console.log(`✅ ${mapped.length}건의 약물 정보를 DB에 저장했습니다.`);
  } catch (error) {
    console.error("❌ 삽입 중 오류 발생:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

insertMedications();
