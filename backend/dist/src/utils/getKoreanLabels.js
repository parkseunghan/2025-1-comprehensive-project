"use strict";
// 🔹 getKoreanLabels.ts
// 정제된 증상 배열을 받아 한글 라벨 배열로 변환
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKoreanLabels = void 0;
const symptomLabel_ko_1 = require("./symptomLabel.ko");
const getKoreanLabels = (keywords) => {
    return keywords.map(symptom => symptomLabel_ko_1.symptomKoreanLabels[symptom] || symptom);
};
exports.getKoreanLabels = getKoreanLabels;
