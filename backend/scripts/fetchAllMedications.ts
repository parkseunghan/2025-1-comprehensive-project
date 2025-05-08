// 📄 scripts/fetchAllMedications.ts

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { medicationAPI } from "../src/utils/public-api"; // ✅ 변경된 구조 반영

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const OUTPUT_PATH = path.resolve(__dirname, "../data/medications.json");
const FAILURE_PATH = path.resolve(__dirname, "../data/medications_failures.json");
const PROGRESS_PATH = path.resolve(__dirname, "../data/medications_progress.json");

const NUM_OF_ROWS = 100;
const DELAY_MS = 500;

let requestCount = 0;
let failures: number[] = [];

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchMedications() {
    let allItems: any[] = [];
    let pageNo = 1;

    while (true) {
        try {
            console.log(`⏳ 요청 중... pageNo=${pageNo}, 누적 요청 수=${++requestCount}`);

            const serviceKey = process.env.MEDICATION_API_KEY;
            if (!serviceKey) {
                console.error("❗ 인증키가 정의되지 않았습니다. .env 파일을 확인하세요.");
                break;
            }

            const { data } = await medicationAPI.get("/getDrbEasyDrugList", {
                params: {
                    serviceKey,
                    pageNo,
                    numOfRows: NUM_OF_ROWS,
                    type: "json", // 서버에 응답 형식 명시
                },
            });

            console.log("🧾 응답 원시 데이터:", typeof data, JSON.stringify(data).slice(0, 300));

            const rawXml = typeof data === "string" ? data : "";
            if (rawXml.includes("SERVICE_KEY_IS_NOT_REGISTERED_ERROR")) {
                console.error("🚫 인증 키 오류 발생. 요청 중단.");
                break;
            }

            const items = data?.body?.items || [];
            if (items.length === 0) {
                console.log(`✅ page ${pageNo} → 더 이상 데이터 없음. 수집 종료.`);
                break;
            }

            console.log(`📦 page ${pageNo} → 수집된 약물 수: ${items.length}`);
            allItems.push(...items);

        } catch (err: any) {
            console.error(`❌ 요청 실패 (page ${pageNo}):`, err.message || err);
            failures.push(pageNo);
        }

        await sleep(DELAY_MS);
        pageNo++;
    }

    // ✅ 결과 저장
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allItems, null, 2), "utf-8");
    console.log(`✅ 총 ${allItems.length}건 저장 완료 → ${OUTPUT_PATH}`);

    if (failures.length > 0) {
        fs.writeFileSync(FAILURE_PATH, JSON.stringify(failures, null, 2), "utf-8");
        console.warn(`⚠️ 실패한 페이지 목록 저장됨 → ${FAILURE_PATH}`);
    }

    fs.writeFileSync(PROGRESS_PATH, JSON.stringify({ lastPage: pageNo }, null, 2), "utf-8");
    console.log(`📌 마지막 요청 페이지 번호 저장됨 → ${PROGRESS_PATH}`);
}

fetchMedications();
