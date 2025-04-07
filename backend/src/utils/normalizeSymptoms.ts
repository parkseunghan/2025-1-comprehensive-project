// 🔹 normalizeSymptoms.ts
// LLM으로부터 추출된 증상 배열을 표준 키워드로 정제합니다.

import { symptomNormalizationMap } from "./symptomMap";

/**
 * 추출된 증상 키워드 배열을 표준화된 키워드로 변환합니다.
 * 중복을 제거하고, 미등록 키워드는 그대로 반환합니다.
 * @param input 추출된 증상 키워드 배열 (예: ['cough', 'dry skin'])
 * @returns 표준화된 키워드 배열 (예: ['cough', 'dryness'])
 */
export const normalizeSymptoms = (input: string[]): string[] => {
  return [...new Set(input.map(symptom =>
    symptomNormalizationMap[symptom.trim().toLowerCase()] ?? symptom.trim().toLowerCase()
  ))];
};
