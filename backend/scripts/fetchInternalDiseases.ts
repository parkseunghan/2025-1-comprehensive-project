// 📄 scripts/fetchInternalDiseases.ts

import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import fs from "fs";
import { parseStringPromise } from "xml2js";
import prisma from "../src/config/prisma.service";

const SERVICE_KEY = process.env.DISEASE_API_KEY;
const API_URL = "https://apis.data.go.kr/B551182/diseaseInfoService1/getDissNameCodeList1";
const MAX_RESULTS = 300;

const generateDescription = (name: string) => `${name}은(는) 대표적인 내과 질병 중 하나입니다.`;
const generateTips = (name: string) => `${name} 예방을 위해 식습관 개선과 정기 검진이 필요합니다.`;

function generateInternalDiseaseCodes(): string[] {
  const validPrefixes = ["E", "I", "J", "K", "N", "D"];
  const codes: string[] = [];

  for (const prefix of validPrefixes) {
    for (let i = 0; i <= 99; i++) {
      codes.push(`${prefix}${i.toString().padStart(2, "0")}`);
    }
  }
  return codes;
}

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
    console.error(`❌ ${code} 요청 실패:`, (err as Error).message);
    return null;
  }
}

async function main() {
  const diseaseCodes = generateInternalDiseaseCodes();
  const results: any[] = [];
  const failedCodes: string[] = [];

  const BATCH_SIZE = 20;

  for (let i = 0; i < diseaseCodes.length && results.length < MAX_RESULTS; i += BATCH_SIZE) {
    const batch = diseaseCodes.slice(i, i + BATCH_SIZE);
    const responses = await Promise.allSettled(batch.map(fetchDisease));

    for (let j = 0; j < responses.length; j++) {
      const result = responses[j];
      const code = batch[j];

      if (result.status === "fulfilled" && result.value && results.length < MAX_RESULTS) {
        results.push(result.value);
        console.log(`✅ ${code} → ${result.value.name}`);
      } else {
        failedCodes.push(code);
        console.error(`❌ ${code} 요청 실패`);
      }
    }
  }

  console.log(`\n📊 최종 수집된 내과 질병 수: ${results.length}`);
  fs.writeFileSync("scripts/failed_codes.json", JSON.stringify(failedCodes, null, 2));

  for (const data of results) {
    await prisma.disease.upsert({
      where: { sickCode: data.sickCode },
      update: {
        name: data.name,
        description: data.description,
        tips: data.tips,
      },
      create: data,
    });
  }

  console.log("✅ 내과 질병 DB 저장 완료");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
