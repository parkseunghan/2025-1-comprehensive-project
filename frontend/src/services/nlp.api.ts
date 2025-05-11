// 📄 src/services/nlp.api.ts
import axios from "./axios";
import { NlpExtractResponse } from "@/types/symptom.types";

/**
 * NLP 서버에 증상 추출 요청
 * 전체 응답을 반환하여 확장성을 확보함
 */
export const extractSymptomsWithNLP = async (
  text: string
): Promise<NlpExtractResponse> => {
  const res = await axios.post("/nlp/extract", { text });
  console.log("✅ NLP 응답 확인:", res.data); // 👈 이걸 넣어 디버깅
  return res.data;
};
