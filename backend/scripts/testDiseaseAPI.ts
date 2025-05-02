// 📄 scripts/testDiseaseAPI.ts

import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { parseStringPromise } from "xml2js";
import prisma from "../src/config/prisma.service";

const SERVICE_KEY = process.env.DISEASE_API_KEY;
const API_URL = "https://apis.data.go.kr/B551182/diseaseInfoService1/getDissNameCodeList1";

const generateDescription = (name: string) =>
  `${name}은(는) 대표적인 감염성 질환 중 하나입니다.`;
const generateTips = (name: string) =>
  `${name} 예방을 위해 손 씻기, 청결 유지, 병원 방문이 필요합니다.`;

async function fetchSingleDisease(code: string) {
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

    const errorMsg = parsed?.OpenAPI_ServiceResponse?.cmmMsgHeader?.returnAuthMsg;
    if (errorMsg) {
      console.error(`❌ ${code} API 오류: ${errorMsg}`);
      return;
    }

    const item = parsed?.response?.body?.items?.item;
    if (!item || !item.sickCd || !item.sickNm) {
      console.log(`❌ ${code} 질병 없음`);
      return;
    }

    const result = {
      sickCode: item.sickCd,
      name: item.sickNm,
      description: generateDescription(item.sickNm),
      tips: generateTips(item.sickNm),
    };

    console.log("✅ 질병 정보:", result);
  } catch (err) {
    console.error(`❌ ${code} 가져오기 실패:`, (err as Error).message);
  }
}

fetchSingleDisease("A00")
  .finally(() => prisma.$disconnect());
