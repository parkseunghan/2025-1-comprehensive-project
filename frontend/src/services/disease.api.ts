// 📄 src/services/disease.api.ts
// 질병 리스트를 가져오는 API

import axios from "./axios";

/**
 * GET /diseases
 * 전체 질병 목록을 불러옵니다.
 */
export const fetchAllDiseases = async (): Promise<string[]> => {
  const res = await axios.get("/diseases");
  // 백엔드는 [{ id, name }] 구조를 반환하므로 name만 추출
  return res.data.map((disease: { name: string }) => disease.name);
};
