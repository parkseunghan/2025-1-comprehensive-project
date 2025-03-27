"use strict";
// 🔹 user.controller.ts
// 이 파일은 사용자 API 요청을 처리하는 컨트롤러 계층입니다.
// 요청 데이터를 파싱하고, 서비스 로직을 호출하며, 응답을 반환합니다.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = void 0;
const userService = __importStar(require("../services/user.services")); // 사용자 서비스 로직 호출
/**
 * 사용자 ID로 사용자 조회
 */
const getUserById = (req, res) => {
    const user = userService.findById(req.params.id); // 서비스 계층에서 유저 검색
    res.json(user); // 결과 반환
};
exports.getUserById = getUserById;
/**
 * 사용자 정보 업데이트
 */
const updateUser = (req, res) => {
    const updated = userService.update(req.params.id, req.body); // ID와 업데이트 데이터 전달
    res.json(updated); // 변경된 사용자 정보 반환
};
exports.updateUser = updateUser;
/**
 * 사용자 삭제
 */
const deleteUser = (req, res) => {
    const deleted = userService.remove(req.params.id); // 유저 삭제 요청
    res.json(deleted); // 삭제된 유저 정보 반환
};
exports.deleteUser = deleteUser;
