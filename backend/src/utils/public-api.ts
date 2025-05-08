// 📄 src/utils/public-api.ts

import axios from "axios";

export const medicationAPI = axios.create({
  baseURL: "https://apis.data.go.kr/1471000/DrbEasyDrugInfoService",
  timeout: 10000,
  headers: {
    Accept: "application/json", // ✅ JSON 응답 요청 명시
  },
});

export const diseaseAPI = axios.create({
  baseURL: "https://apis.data.go.kr/B551182/diseaseInfoService1",
  timeout: 10000,
  headers: {
    Accept: "application/json", // ✅ JSON 응답 요청 명시
  },
});
