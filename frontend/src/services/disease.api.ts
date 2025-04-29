// 📄 src/services/disease.api.ts
// 질병 리스트를 가져오는 API

import axios from "./axios";

/**
 * GET /diseases
 * 전체 질병 목록을 불러옵니다.
 */
// 전체 질병 조회
export const fetchAllDiseases = () => {
  return axios.get("/diseases");
};