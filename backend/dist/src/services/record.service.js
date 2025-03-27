"use strict";
// 🔹 record.service.ts
// 이 파일은 증상 기록(SymptomRecord) 관련 비즈니스 로직을 처리하는 서비스 계층입니다.
// 더미 데이터 기반으로 기록 생성, 조회, 삭제 기능을 제공합니다.
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.findById = exports.findByUserId = exports.create = void 0;
const symptomRecords_1 = require("../mock/symptomRecords");
const symptomOnRecords_1 = require("../mock/symptomOnRecords");
/**
 * 증상 기록 생성
 * @param userId 사용자 ID
 * @param symptomIds 증상 ID 배열
 */
const create = (userId, symptomIds) => {
    const recordId = `rec-${Date.now()}`;
    const newRecord = {
        id: recordId,
        userId,
        createdAt: new Date().toISOString(),
    };
    symptomRecords_1.symptomRecords.push(newRecord); // 기록 추가
    // 증상 연결 추가
    symptomIds.forEach((symptomId) => {
        symptomOnRecords_1.symptomOnRecords.push({
            id: `sor-${Date.now()}-${Math.random()}`,
            recordId,
            symptomId,
        });
    });
    return newRecord;
};
exports.create = create;
/**
 * 사용자 ID로 해당 사용자의 증상 기록 전체 조회
 */
const findByUserId = (userId) => {
    return symptomRecords_1.symptomRecords.filter((rec) => rec.userId === userId);
};
exports.findByUserId = findByUserId;
/**
 * 특정 증상 기록 ID로 조회
 */
const findById = (id) => {
    return symptomRecords_1.symptomRecords.find((rec) => rec.id === id);
};
exports.findById = findById;
/**
 * 특정 증상 기록 삭제
 */
const remove = (id) => {
    const index = symptomRecords_1.symptomRecords.findIndex((rec) => rec.id === id);
    if (index !== -1) {
        const deleted = symptomRecords_1.symptomRecords.splice(index, 1)[0];
        // 관련된 symptomOnRecords도 함께 삭제
        for (let i = symptomOnRecords_1.symptomOnRecords.length - 1; i >= 0; i--) {
            if (symptomOnRecords_1.symptomOnRecords[i].recordId === id) {
                symptomOnRecords_1.symptomOnRecords.splice(i, 1);
            }
        }
        return deleted;
    }
    return { message: "Not found" };
};
exports.remove = remove;
