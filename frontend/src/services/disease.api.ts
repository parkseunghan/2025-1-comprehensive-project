// 📄 services/disease.api.ts

import axios from "./axios";
import { Disease } from "@/types/disease.types";

/**
 * 전체 질병 목록 불러오기
 */
export const fetchAllDiseases = async (): Promise<Disease[]> => {
  const res = await axios.get("/diseases");
  return res.data;
};

/**
 * 🔍 질병 이름으로 설명 및 관리 팁 조회
 * GET /diseases/info-by-name?name=기관지 천식
 */

export const getDiseaseInfo = async (name: string): Promise<Disease | null> => {
  try {
    const res = await axios.get("/diseases/info-by-name", {
      params: { name },
    });
    return res.data;
  } catch (e) {
    console.error("❌ 질병 정보 조회 실패:", e);
    return null;
  }
};
