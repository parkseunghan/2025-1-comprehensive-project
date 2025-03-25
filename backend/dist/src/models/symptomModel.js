"use strict";
// src/models/symptomModel.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymptoms = exports.recordSymtom = void 0;
let syptoms = [];
const recordSymtom = (description, severity) => {
    const newSymptom = { id: syptoms.length + 1, description, severity };
    syptoms.push(newSymptom);
    return newSymptom;
};
exports.recordSymtom = recordSymtom;
const getSymptoms = () => {
    return syptoms;
};
exports.getSymptoms = getSymptoms;
