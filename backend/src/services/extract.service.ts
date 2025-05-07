// 📄 src/services/extract.service.ts
import { callSymptomExtractAPI } from "../utils/extract-api";

/**
 * 사용자 문장에서 증상 및 시간 정보를 추출합니다.
 * @param text 사용자 입력 텍스트
 * @returns symptoms 배열
 */
export const extractSymptomsFromText = async (text: string) => {
  return await callSymptomExtractAPI(text);
};
