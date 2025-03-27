"use strict";
// 🔹 disease.controller.ts
// 이 파일은 '지병(Disease)' 관련 API 요청을 처리하는 Express 컨트롤러 계층입니다.
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
exports.deleteUserDisease = exports.addUserDisease = exports.getUserDiseases = exports.getDiseaseById = exports.getAllDiseases = void 0;
const diseaseService = __importStar(require("../services/disease.service"));
/**
 * 전체 지병 목록을 조회합니다.
 * GET /diseases
 */
const getAllDiseases = (req, res) => {
    const result = diseaseService.findAll(); // 전체 지병 데이터 조회
    res.json(result); // 결과 반환
};
exports.getAllDiseases = getAllDiseases;
/**
 * 특정 ID로 지병을 조회합니다.
 * GET /diseases/:id
 */
const getDiseaseById = (req, res) => {
    const disease = diseaseService.findById(req.params.id); // ID로 검색
    if (!disease) {
        res.status(404).json({ message: "Not found" }); // 없으면 404
    }
    else {
        res.json(disease); // 결과 반환
    }
};
exports.getDiseaseById = getDiseaseById;
/**
 * 사용자 ID로 해당 사용자의 지병 목록을 조회합니다.
 * GET /users/:userId/diseases
 */
const getUserDiseases = (req, res) => {
    const result = diseaseService.findByUserId(req.params.userId); // userId로 검색
    res.json(result); // 결과 반환
};
exports.getUserDiseases = getUserDiseases;
/**
 * 사용자에게 지병을 추가합니다.
 * POST /users/:userId/diseases
 */
const addUserDisease = (req, res) => {
    const { diseaseId } = req.body; // body에서 diseaseId 추출
    const result = diseaseService.addDiseaseToUser(req.params.userId, diseaseId); // 서비스 호출
    res.status(201).json(result); // 201 Created 반환
};
exports.addUserDisease = addUserDisease;
/**
 * 사용자의 지병을 삭제합니다.
 * DELETE /users/:userId/diseases/:diseaseId
 */
const deleteUserDisease = (req, res) => {
    const result = diseaseService.removeDiseaseFromUser(req.params.userId, req.params.diseaseId); // 관계 제거
    res.json(result); // 결과 반환
};
exports.deleteUserDisease = deleteUserDisease;
