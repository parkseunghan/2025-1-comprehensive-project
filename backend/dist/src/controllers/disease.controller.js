"use strict";
// 🔹 disease.controller.ts
// 이 파일은 '지병(Disease)' 관련 API 요청을 처리하는 Express 컨트롤러 계층입니다.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserDisease = exports.addUserDisease = exports.getUserDiseases = exports.getDiseaseById = exports.getAllDiseases = void 0;
const diseaseService = __importStar(require("../services/disease.service"));
/**
 * 전체 지병 목록을 조회합니다.
 * GET /diseases
 */
const getAllDiseases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield diseaseService.findAll();
    res.json(result);
});
exports.getAllDiseases = getAllDiseases;
/**
 * 특정 ID로 지병을 조회합니다.
 * GET /diseases/:id
 */
const getDiseaseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const disease = yield diseaseService.findById(req.params.id);
    if (!disease) {
        res.status(404).json({ message: "지병을 찾을 수 없습니다." });
        return;
    }
    res.json(disease);
});
exports.getDiseaseById = getDiseaseById;
/**
 * 사용자 ID로 해당 사용자의 지병 목록을 조회합니다.
 * GET /users/:userId/diseases
 */
const getUserDiseases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield diseaseService.findByUserId(req.params.userId);
    res.json(result);
});
exports.getUserDiseases = getUserDiseases;
/**
 * 사용자에게 지병을 추가합니다.
 * POST /users/:userId/diseases
 */
const addUserDisease = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { diseaseId } = req.body;
    if (!diseaseId) {
        res.status(400).json({ message: "diseaseId가 필요합니다." });
        return;
    }
    const result = yield diseaseService.addDiseaseToUser(req.params.userId, diseaseId);
    res.status(201).json(result);
});
exports.addUserDisease = addUserDisease;
/**
 * 사용자의 지병을 삭제합니다.
 * DELETE /users/:userId/diseases/:diseaseId
 */
const deleteUserDisease = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, diseaseId } = req.params;
    const result = yield diseaseService.removeDiseaseFromUser(userId, diseaseId);
    res.json(result);
});
exports.deleteUserDisease = deleteUserDisease;
