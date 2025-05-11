// 📄 src/utils/nlp-api.ts
import axios from "axios";
import { NlpExtractResponse } from "../types/nlp.types";

const nlpApi = axios.create({
  baseURL: process.env.NLP_API_URL || "http://localhost:8002",
  timeout: 10000,
});

export const callNlpSymptomAPI = async (
  text: string
): Promise<NlpExtractResponse> => {
  try {
    const res = await nlpApi.post("/extract", { text });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[callNlpSymptomAPI] ❌ NLP 서버 응답 오류:", error.response?.data || error.message);
    } else {
      console.error("[callNlpSymptomAPI] ❌ 알 수 없는 오류:", error);
    }

    return {
      original: text,
      cleaned: "",
      translated: "",
      results: [],
    };
  }
};
