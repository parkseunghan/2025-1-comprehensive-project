"use strict";
// 🔹 symptom.controller.ts
// 이 파일은 '증상(Symptom)' 관련 API 요청을 처리하는 Express 컨트롤러입니다.
// 증상 목록 조회 및 개별 증상 조회 기능을 제공합니다.
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
exports.getSymptomById = exports.getAllSymptoms = void 0;
const symptomService = __importStar(require("../services/symptom.service"));
/**
 * 전체 증상 목록을 조회합니다.
 * GET /symptoms
 */
const getAllSymptoms = (req, res) => {
    const result = symptomService.findAll(); // 모든 증상 반환
    res.json(result); // JSON 응답
};
exports.getAllSymptoms = getAllSymptoms;
/**
 * 특정 증상 ID로 증상을 조회합니다.
 * GET /symptoms/:id
 */
const getSymptomById = (req, res) => {
    const symptom = symptomService.findById(req.params.id); // ID로 검색
    if (!symptom) {
        res.status(404).json({ message: "Not found" }); // 없음 처리
    }
    else {
        res.json(symptom); // 결과 반환
    }
};
exports.getSymptomById = getSymptomById;
