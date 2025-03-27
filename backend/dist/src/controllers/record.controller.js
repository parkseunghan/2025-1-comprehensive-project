"use strict";
// 🔹 record.controller.ts
// 이 파일은 증상 기록(SymptomRecord)에 대한 요청을 처리하는 컨트롤러 계층입니다.
// 사용자 증상 기록 생성, 조회, 삭제 기능을 담당합니다.
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
exports.deleteSymptomRecord = exports.getSymptomRecordById = exports.getSymptomRecordsByUser = exports.createSymptomRecord = void 0;
const recordService = __importStar(require("../services/record.service"));
/**
 * 사용자 증상 기록 생성
 * POST /users/:userId/symptom-records
 */
const createSymptomRecord = (req, res) => {
    const { symptomIds } = req.body; // 증상 ID 배열 추출
    const result = recordService.create(req.params.userId, symptomIds); // 생성 요청
    res.status(201).json(result); // 생성된 기록 반환
};
exports.createSymptomRecord = createSymptomRecord;
/**
 * 특정 사용자의 증상 기록 전체 조회
 * GET /users/:userId/symptom-records
 */
const getSymptomRecordsByUser = (req, res) => {
    const result = recordService.findByUserId(req.params.userId); // 사용자 기준 필터링
    res.json(result);
};
exports.getSymptomRecordsByUser = getSymptomRecordsByUser;
/**
 * 특정 증상 기록 ID로 조회
 * GET /symptom-records/:id
 */
const getSymptomRecordById = (req, res) => {
    const result = recordService.findById(req.params.id); // ID로 찾기
    if (!result) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        res.json(result);
    }
};
exports.getSymptomRecordById = getSymptomRecordById;
/**
 * 특정 증상 기록 삭제
 * DELETE /symptom-records/:id
 */
const deleteSymptomRecord = (req, res) => {
    const result = recordService.remove(req.params.id); // 삭제 요청
    res.json(result);
};
exports.deleteSymptomRecord = deleteSymptomRecord;
