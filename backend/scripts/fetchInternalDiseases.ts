// 📄 scripts/fetchInternalDiseases.ts
import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import fs from "fs";
import { parseStringPromise } from "xml2js";
import prisma from "../src/config/prisma.service";

const SERVICE_KEY = process.env.DISEASE_API_KEY;
const API_URL = "https://apis.data.go.kr/B551182/diseaseInfoService1/getDissNameCodeList1";
const DELAY_MS = 300; // 요청 간 딜레이 (ms)

const generateDescription = (name: string) => `${name}은(는) 대표적인 내과 질병 중 하나입니다.`;
const generateTips = (name: string) => `${name} 예방을 위해 식습관 개선과 정기 검진이 필요합니다.`;

// 질병 코드 생성기
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

// 0.3초 지연
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API 요청 함수
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

// 메인 실행 함수
async function main() {
  const allCodes = generateInternalDiseaseCodes();

  // 1. DB에 이미 저장된 코드 확인
  const existing = await prisma.disease.findMany({ select: { sickCode: true } });
  const existingSet = new Set(existing.map((d) => d.sickCode));

  const results: any[] = [];
  const failedCodes: string[] = [];

  // 2. 새 코드만 API 요청
  for (const code of allCodes) {
    if (existingSet.has(code)) {
      console.log(`⏩ ${code} 건너뜀`);
      continue;
    }

    const data = await fetchDisease(code);
    if (data) {
      results.push(data);
      console.log(`✅ ${code} → ${data.name}`);
    } else {
      failedCodes.push(code);
    }

    await delay(DELAY_MS);
  }

  // 3. 실패 코드 저장
  fs.writeFileSync("scripts/failed_codes.json", JSON.stringify(failedCodes, null, 2));
  console.log(`\n📊 수집 완료: ${results.length}개 | 실패: ${failedCodes.length}개`);

  // 4. DB에 삽입
  for (const data of results) {
    try {
      await prisma.disease.create({ data });
    } catch (e: any) {
      console.error(`❌ DB 삽입 실패 (${data.sickCode}):`, e.message);
    }
  }

  console.log("✅ DB 저장 완료");
}

main()
  .catch((e) => {
    console.error("❌ 전체 오류:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
