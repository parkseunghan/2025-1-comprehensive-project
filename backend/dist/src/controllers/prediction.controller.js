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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPredictionByRecord = exports.createPrediction = void 0;
const predictionService = __importStar(require("../services/prediction.service"));
/**
 * 예측 결과 생성 (모델 연결 전 더미 기반)
 * POST /symptom-records/:recordId/prediction
 */
const createPrediction = (req, res) => {
    const result = predictionService.create(req.params.recordId); // 예측 생성
    res.status(201).json(result);
};
exports.createPrediction = createPrediction;
/**
 * 특정 증상 기록에 대한 예측 결과 조회
 * GET /symptom-records/:recordId/prediction
 */
const getPredictionByRecord = (req, res) => {
    const result = predictionService.findByRecordId(req.params.recordId); // 예측 찾기
    if (!result) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        res.json(result);
    }
};
exports.getPredictionByRecord = getPredictionByRecord;
