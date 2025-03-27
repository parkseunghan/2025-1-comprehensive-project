"use strict";
// 🔹 user.service.ts
// 이 파일은 사용자 관련 비즈니스 로직을 처리하는 서비스 계층입니다.
// 예시에서는 더미 데이터로 사용자 데이터를 검색/수정/삭제합니다.
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findById = void 0;
const users_1 = require("../mock/users"); // 더미 사용자 데이터 로딩
/**
 * ID로 사용자 찾기
 * @param id 사용자 고유 ID
 * @returns 해당 사용자의 객체 or undefined
 */
const findById = (id) => {
    return users_1.users.find((u) => u.id === id); // 배열에서 ID 매칭
};
exports.findById = findById;
/**
 * 사용자 정보 업데이트
 * @param id 사용자 ID
 * @param data 수정할 정보 객체
 * @returns 수정된 사용자 객체 or null
 */
const update = (id, data) => {
    const index = users_1.users.findIndex((u) => u.id === id); // 인덱스 검색
    if (index !== -1) {
        users_1.users[index] = Object.assign(Object.assign({}, users_1.users[index]), data); // 기존 데이터 병합
        return users_1.users[index]; // 수정된 객체 반환
    }
    return null;
};
exports.update = update;
/**
 * 사용자 삭제
 * @param id 사용자 ID
 * @returns 삭제된 사용자 객체 or null
 */
const remove = (id) => {
    const index = users_1.users.findIndex((u) => u.id === id); // 인덱스 찾기
    if (index !== -1) {
        const deleted = users_1.users.splice(index, 1)[0]; // 배열에서 삭제
        return deleted;
    }
    return null;
};
exports.remove = remove;
