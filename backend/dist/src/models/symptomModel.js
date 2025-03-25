"use strict";
// src/models/symptomModel.ts
// 증상 기록
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymptoms = exports.recordSymptom = void 0;
let symptoms = [];
// export const recordSymptom = (description: string, severity: string) => {
const recordSymptom = (description) => {
    // const newSymptom: Symptom = { id: syptoms.length + 1, description, severity };
    const newSymptom = { id: symptoms.length + 1, description };
    symptoms.push(newSymptom);
    return newSymptom;
};
exports.recordSymptom = recordSymptom;
const getSymptoms = () => {
    return symptoms;
};
exports.getSymptoms = getSymptoms;
