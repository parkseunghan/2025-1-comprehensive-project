// 📄 src/services/symptom.api.ts

import axios from "./axios"; // 공통 axios 인스턴스 사용
import { Symptom } from "@/types/symptom.types";

/**
 * 🔹 전체 증상 리스트 조회 (카테고리 포함)
 * GET /api/symptoms
 */
export const fetchAllSymptoms = async (): Promise<Symptom[]> => {
  const response = await axios.get<Symptom[]>("/symptoms");
  return response.data;
};
