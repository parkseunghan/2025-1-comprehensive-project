// 📄 src/utils/public-api.ts
import axios from "axios";

export const publicAPI = axios.create({
  baseURL: "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService",
  params: {
    serviceKey: process.env.MEDICATION_API_KEY, // URL 인코딩된 인증키
  },
});

