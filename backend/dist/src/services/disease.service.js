"use strict";
// 🔹 disease.service.ts
// 이 파일은 '지병' 객체와 사용자의 객체 간의 관계를 개발적으로 처리하는 서비스 계층입니다.
// 더미 데이터를 기원으로 데이터가 추가되면, 검사/추가/삭제 가능성을 가진 데이터를 통해 목록 조회가 가능합니다.
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDiseaseFromUser = exports.addDiseaseToUser = exports.findByUserId = exports.findById = exports.findAll = void 0;
const diseases_1 = require("../mock/diseases"); // 지병 데이터 (DB처리 전 Mock)
const userDiseases_1 = require("../mock/userDiseases"); // 사용자-지병 N:M 관계
/** 전체 지병 목록 조회 */
const findAll = () => {
    return diseases_1.diseases;
};
exports.findAll = findAll;
/** 특정 ID의 지병 검색 */
const findById = (id) => {
    return diseases_1.diseases.find((d) => d.id === id);
};
exports.findById = findById;
/** userId를 기본으로 사용자의 지병 목록 조회 */
const findByUserId = (userId) => {
    const matched = userDiseases_1.userDiseases.filter((ud) => ud.userId === userId); // userId 일치 사용자
    return matched.map((rel) => diseases_1.diseases.find((d) => d.id === rel.diseaseId)); // 각 관계에서 지병 찾기
};
exports.findByUserId = findByUserId;
/** 사용자에게 지병 추가 */
const addDiseaseToUser = (userId, diseaseId) => {
    const already = userDiseases_1.userDiseases.find((ud) => ud.userId === userId && ud.diseaseId === diseaseId);
    if (already)
        return { message: "Already added" };
    const newItem = {
        id: `ud-${Date.now()}`,
        userId,
        diseaseId,
    };
    userDiseases_1.userDiseases.push(newItem); // 데이터에 추가
    return newItem;
};
exports.addDiseaseToUser = addDiseaseToUser;
/** 사용자의 지병 삭제 */
const removeDiseaseFromUser = (userId, diseaseId) => {
    const index = userDiseases_1.userDiseases.findIndex((ud) => ud.userId === userId && ud.diseaseId === diseaseId);
    if (index !== -1) {
        const removed = userDiseases_1.userDiseases.splice(index, 1)[0]; // 데이터에서 삭제
        return removed;
    }
    return { message: "Not found" };
};
exports.removeDiseaseFromUser = removeDiseaseFromUser;
