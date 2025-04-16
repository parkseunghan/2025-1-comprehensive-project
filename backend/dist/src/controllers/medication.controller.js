"use strict";
// 🔹 medication.controller.ts
// 이 파일은 '복용약(Medication)' 관련 API 요청을 처리하는 Express 컨트롤러 계층입니다.
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
exports.deleteUserMedication = exports.addUserMedication = exports.getUserMedications = exports.getMedicationById = exports.getAllMedications = void 0;
const medicationService = __importStar(require("../services/medication.service"));
/**
 * 전체 약물 목록을 조회합니다.
 * GET /medications
 */
const getAllMedications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield medicationService.findAll();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "약물 목록 조회 중 오류가 발생했습니다." });
    }
});
exports.getAllMedications = getAllMedications;
/**
 * 특정 ID로 약물을 조회합니다.
 * GET /medications/:id
 */
const getMedicationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medication = yield medicationService.findById(req.params.id);
        if (!medication) {
            res.status(404).json({ message: "약물을 찾을 수 없습니다." });
            return;
        }
        res.json(medication);
    }
    catch (error) {
        res.status(500).json({ message: "약물 조회 중 오류가 발생했습니다." });
    }
});
exports.getMedicationById = getMedicationById;
/**
 * 사용자 ID로 해당 사용자의 약물 목록을 조회합니다.
 * GET /users/:userId/medications
 */
const getUserMedications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield medicationService.findByUserId(req.params.userId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "사용자 약물 조회 중 오류가 발생했습니다." });
    }
});
exports.getUserMedications = getUserMedications;
/**
 * 사용자에게 약물을 추가합니다.
 * POST /users/:userId/medications
 */
const addUserMedication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { medicationId } = req.body;
    if (!medicationId) {
        res.status(400).json({ message: "medicationId가 필요합니다." });
        return;
    }
    try {
        const result = yield medicationService.addMedicationToUser(req.params.userId, medicationId);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "약물 추가 중 오류가 발생했습니다." });
    }
});
exports.addUserMedication = addUserMedication;
/**
 * 사용자의 약물을 삭제합니다.
 * DELETE /users/:userId/medications/:medicationId
 */
const deleteUserMedication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, medicationId } = req.params;
    try {
        const result = yield medicationService.removeMedicationFromUser(userId, medicationId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "약물 삭제 중 오류가 발생했습니다." });
    }
});
exports.deleteUserMedication = deleteUserMedication;
