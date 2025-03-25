// src/models/symptomModel.ts
// 증상 기록

interface Symptom {
    id: number;
    description: string;
    severity: string;
}

let syptoms: Symptom[] = [];

export const recordSymtom = (description: string, severity: string) => {
    const newSymptom: Symptom = { id: syptoms.length + 1, description, severity };
    syptoms.push(newSymptom);
    return newSymptom;
}

export const getSymptoms = () => {
    return syptoms;
}