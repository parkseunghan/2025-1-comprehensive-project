// 📄 scripts/retry_failed_codes.ts

import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import fs from "fs";
import { parseStringPromise } from "xml2js";
import prisma from "../src/config/prisma.service";

const SERVICE_KEY = process.env.DISEASE_API_KEY!;
const API_URL = "https://apis.data.go.kr/B551182/diseaseInfoService1/getDissNameCodeList1";

const generateDescription = (name: string) => `${name}은(는) 대표적인 내과 질병 중 하나입니다.`;
const generateTips = (name: string) => `${name} 예방을 위해 식습관 개선과 정기 검진이 필요합니다.`;

async function fetchDisease(code: string) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        serviceKey: SERVICE_KEY,
        searchText: code,
        diseaseType: "SICK_CD",
        numOfRows: 1,
        pageNo: 1,
        sickType: 1,
        medTp: 1,
      },
      headers: { Accept: "application/xml" },
      responseType: "text",
    });

    const parsed = await parseStringPromise(response.data, { explicitArray: false });
    const item = parsed.response.body?.items?.item;

    if (!item || !item.sickCd || !item.sickNm) return null;

    return {
      sickCode: item.sickCd,
      name: item.sickNm,
      description: generateDescription(item.sickNm),
      tips: generateTips(item.sickNm),
    };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

async function main() {
  const failedList: { code: string; reason: string }[] = JSON.parse(
    fs.readFileSync("scripts/failed_codes.json", "utf-8")
  );

  console.log(`📄 재요청할 코드 수: ${failedList.length}`);

  const newFailedList: { code: string; reason: string }[] = [];

  for (const { code } of failedList) {
    const result = await fetchDisease(code);

    if (!result || "error" in result) {
      const reason = result?.error || "Unknown error";
      console.error(`❌ ${code} 실패: ${reason}`);
      newFailedList.push({ code, reason });
      continue;
    }

    await prisma.disease.upsert({
      where: { sickCode: result.sickCode },
      update: {
        name: result.name,
        description: result.description,
        tips: result.tips,
      },
      create: result,
    });

    console.log(`✅ ${code} → ${result.name}`);
  }

  // 실패한 항목만 다시 저장
  fs.writeFileSync("scripts/failed_codes.json", JSON.stringify(newFailedList, null, 2));

  console.log("🚀 재시도 완료");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
