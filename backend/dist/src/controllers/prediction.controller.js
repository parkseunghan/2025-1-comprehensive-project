"use strict";
// 🔹 prediction.controller.ts
// 이 파일은 예측(Prediction) API 요청을 처리하는 컨트롤러입니다.
// 증상 기록에 대한 예측 생성 및 조회 기능을 담당합니다.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recreatePrediction = exports.deletePrediction = exports.getPredictionByRecord = exports.createPrediction = void 0;
const predictionService = __importStar(require("../services/prediction.service"));
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 예측 결과 생성 (모델 연결 전 더미 기반)
 * POST /symptom-records/:recordId/prediction
 */
const createPrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recordId } = req.params;
    // ✅ 증상 기록이 존재하는지 확인
    const record = yield prisma_service_1.default.symptomRecord.findUnique({
        where: { id: recordId },
    });
    if (!record) {
        res.status(404).json({ message: "증상 기록을 찾을 수 없습니다." });
        return;
    }
    const result = yield predictionService.create(recordId);
    res.status(201).json(result);
});
exports.createPrediction = createPrediction;
/**
 * 특정 증상 기록에 대한 예측 결과 조회
 * GET /symptom-records/:recordId/prediction
 */
const getPredictionByRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield predictionService.findByRecordId(req.params.recordId);
    if (!result) {
        res.status(404).json({ message: "예측 결과를 찾을 수 없습니다." });
        return;
    }
    res.json(result);
});
exports.getPredictionByRecord = getPredictionByRecord;
/** 예측 삭제 */
const deletePrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield predictionService.remove(req.params.recordId);
    if (!deleted) {
        res.status(404).json({ message: "예측을 찾을 수 없습니다." });
        return;
    }
    res.json(deleted);
});
exports.deletePrediction = deletePrediction;
/** 예측 재요청 (삭제되어도 새로 생성) */
const recreatePrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recordId } = req.params;
    const record = yield prisma_service_1.default.symptomRecord.findUnique({ where: { id: recordId } });
    if (!record) {
        res.status(404).json({ message: "증상 기록을 찾을 수 없습니다." });
        return;
    }
    // 기존 예측 삭제
    yield predictionService.remove(recordId);
    // 새 예측 생성
    const result = yield predictionService.create(recordId);
    res.status(201).json(result);
});
exports.recreatePrediction = recreatePrediction;
