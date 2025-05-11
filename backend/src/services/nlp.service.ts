// 📄 src/services/nlp.service.ts
import { callNlpSymptomAPI } from "../utils/nlp-api";

/**
 * NLP 기반 증상 추출 서비스
 * @param text 사용자 입력 텍스트
 * @returns [{ symptom, time }]
 */
export const extractSymptomsWithNLP = async (text: string) => {
  return await callNlpSymptomAPI(text);
};
