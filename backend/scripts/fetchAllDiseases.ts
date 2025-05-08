// 📄 scripts/fetchAllDiseases.ts

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { diseaseAPI } from "../src/utils/public-api"; // ✅ 통일된 API 인스턴스 사용

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const OUTPUT_PATH = path.resolve(__dirname, "../data/diseases.json");
const FAILURE_PATH = path.resolve(__dirname, "../data/diseases_failures.json");
const PROGRESS_PATH = path.resolve(__dirname, "../data/diseases_progress.json");

const NUM_OF_ROWS = 100;
const DELAY_MS = 500;

let requestCount = 0;
let failures: number[] = [];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchDiseaseCodes() {
  let allItems: any[] = [];
  let pageNo = 1;

  while (true) {
    try {
      console.log(`⏳ 요청 중... pageNo=${pageNo}, 누적 요청 수=${++requestCount}`);

      const serviceKey = process.env.DISEASE_API_KEY;
      if (!serviceKey) {
        console.error("❗ 인증키가 정의되지 않았습니다. .env 파일을 확인하세요.");
        break;
      }

      const { data } = await diseaseAPI.get("/getDissNameCodeList1", {
        params: {
          serviceKey,
          pageNo,
          numOfRows: NUM_OF_ROWS,
          sickType: 1,
          medTp: 1,
          type: "json",
        },
      });

      console.log("🧾 응답 원시 데이터:", typeof data, JSON.stringify(data).slice(0, 300));

      const items = data?.response?.body?.items?.item || [];

      if (items.length === 0) {
        console.log(`✅ page ${pageNo} → 더 이상 데이터 없음. 수집 종료.`);
        break;
      }

      const parsed = items.map((item: any) => ({
        code: item.sickCd || "",
        name: item.sickNm || "",
        englishName: item.sickEngNm || "",
      }));

      console.log(`📦 page ${pageNo} → 수집된 질병 수: ${parsed.length}`);
      allItems.push(...parsed);

    } catch (err: any) {
      console.error(`❌ 요청 실패 (page ${pageNo}):`, err.message || err);
      failures.push(pageNo);
    }

    await sleep(DELAY_MS);
    pageNo++;
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allItems, null, 2), "utf-8");
  console.log(`✅ 총 ${allItems.length}건 저장 완료 → ${OUTPUT_PATH}`);

  if (failures.length > 0) {
    fs.writeFileSync(FAILURE_PATH, JSON.stringify(failures, null, 2), "utf-8");
    console.warn(`⚠️ 실패한 페이지 목록 저장됨 → ${FAILURE_PATH}`);
  }

  fs.writeFileSync(PROGRESS_PATH, JSON.stringify({ lastPage: pageNo }, null, 2), "utf-8");
  console.log(`📌 마지막 요청 페이지 번호 저장됨 → ${PROGRESS_PATH}`);
}

fetchDiseaseCodes();
