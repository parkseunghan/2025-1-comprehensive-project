"use strict";
// 🔹 symptom.service.ts
// 이 파일은 '증상(Symptom)' 데이터를 더미 기반으로 조회하는 서비스 계층입니다.
// 전체 목록과 특정 ID로 검색하는 기능을 제공합니다.
Object.defineProperty(exports, "__esModule", { value: true });
exports.findById = exports.findAll = void 0;
const symptoms_1 = require("../mock/symptoms"); // 더미 증상 데이터 로딩
/**
 * 전체 증상 목록을 반환합니다.
 */
const findAll = () => {
    return symptoms_1.symptoms; // 그대로 반환
};
exports.findAll = findAll;
/**
 * 특정 ID에 해당하는 증상을 반환합니다.
 * @param id 증상 ID
 */
const findById = (id) => {
    return symptoms_1.symptoms.find((s) => s.id === id); // ID 매칭
};
exports.findById = findById;
