// 🔹 getKoreanLabels.ts
// 정제된 증상 배열을 받아 한글 라벨 배열로 변환

import { symptomKoreanLabels } from "./symptomLabel.ko";

export const getKoreanLabels = (keywords: string[]): string[] => {
  return keywords.map(symptom => symptomKoreanLabels[symptom] || symptom);
};
