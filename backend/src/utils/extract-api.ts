// 📄 src/utils/extract-api.ts
import axios from "axios";

// ✅ Axios 인스턴스 (기본 URL은 .env에서)
const extractApi = axios.create({
  baseURL: process.env.EXTRACT_API_URL || "http://localhost:8002",
  timeout: 10000,
});

/**
 * 증상 추출 API 호출
 * @param text 사용자 입력 문장
 * @returns symptoms 배열 [{ symptom, time }]
 */
export const callSymptomExtractAPI = async (text: string) => {
  try {
    const res = await extractApi.post("/extract", { text });
    return res.data.symptoms;
  } catch (error) {
    console.error("[callSymptomExtractAPI] ❌ NLP 서버 요청 실패:", error);
    return [];
  }
};
