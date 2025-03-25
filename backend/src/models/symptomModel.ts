// src/models/symptomModel.ts
// 증상 기록

interface Symptom {
    id: number;
    description: string;
    // severity: string;
}

let symptoms: Symptom[] = [];

// export const recordSymptom = (description: string, severity: string) => {
export const recordSymptom = (description: string) => {
    // const newSymptom: Symptom = { id: syptoms.length + 1, description, severity };
    const newSymptom: Symptom = { id: symptoms.length + 1, description };
    symptoms.push(newSymptom);
    return newSymptom;
}

export const getSymptoms = () => {
    return symptoms;
}