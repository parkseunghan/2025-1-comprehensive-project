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
exports.getSymptomById = exports.getAllSymptoms = void 0;
const symptomService = __importStar(require("../services/symptom.service"));
/**
 * 전체 증상 목록을 조회합니다.
 * GET /symptoms
 */
const getAllSymptoms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield symptomService.findAll();
    res.json(result);
});
exports.getAllSymptoms = getAllSymptoms;
/**
 * 특정 증상 ID로 증상을 조회합니다.
 * GET /symptoms/:id
 */
const getSymptomById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const symptom = yield symptomService.findById(req.params.id);
    if (!symptom) {
        res.status(404).json({ message: "증상을 찾을 수 없습니다." });
        return;
    }
    res.json(symptom);
});
exports.getSymptomById = getSymptomById;
