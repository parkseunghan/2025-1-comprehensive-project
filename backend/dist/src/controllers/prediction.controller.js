"use strict";
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
exports.savePredictions = exports.getPredictionByRecord = exports.predictFromAI = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
const predictionService = __importStar(require("../services/prediction.service"));
const recordService = __importStar(require("../services/record.service"));
(0, dotenv_1.config)(); // .env 환경변수 로드
/**
 * POST /api/prediction
 * AI 서버에 증상 데이터를 보내고 예측 결과를 반환합니다.
 */
const predictFromAI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symptomKeywords, age, gender, height, weight, bmi, diseases, medications, } = req.body;
        // ✅ 디버깅 로그
        console.log("📦 [predictFromAI] 요청 수신:");
        console.log("  - gender:", gender);
        console.log("  - age:", age);
        console.log("  - height:", height);
        console.log("  - weight:", weight);
        console.log("  - bmi:", bmi);
        console.log("  - symptomKeywords:", symptomKeywords);
        console.log("  - diseases:", diseases);
        console.log("  - medications:", medications);
        console.log("  - raw req.body:", req.body);
        // 필수 입력 검증
        if (!symptomKeywords || !Array.isArray(symptomKeywords)) {
            res.status(400).json({ message: "symptomKeywords가 필요합니다." });
            return;
        }
        // AI 서버에 요청 보내기
        const aiRes = yield axios_1.default.post(`${process.env.AI_API_URL}/predict`, {
            symptom_keywords: symptomKeywords,
            age,
            gender,
            height,
            weight,
            bmi,
            chronic_diseases: diseases, // ✅ AI 서버는 chronic_diseases로 받음
            medications,
        });
        res.status(200).json(aiRes.data);
    }
    catch (error) {
        console.error("❌ AI 예측 오류:", error.message);
        res.status(500).json({ message: "AI 예측 실패", error: error.message });
    }
});
exports.predictFromAI = predictFromAI;
const getPredictionByRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recordId } = req.params;
        const result = yield predictionService.findByRecord(recordId);
        if (!result) {
            res.status(404).json({ message: "예측 결과를 찾을 수 없습니다." });
            return;
        }
        res.json(result);
    }
    catch (err) {
        console.error("❌ 예측 결과 조회 오류:", err);
        res.status(500).json({ message: "예측 결과 조회 중 오류가 발생했습니다." });
    }
});
exports.getPredictionByRecord = getPredictionByRecord;
/**
 * 증상 기록 기반 예측 결과 저장
 * POST /api/prediction/symptom-records/:recordId/prediction
 */
const savePredictions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recordId } = req.params;
        const { predictions } = req.body;
        if (!predictions || !Array.isArray(predictions)) {
            return res.status(400).json({ message: "predictions 배열이 필요합니다." });
        }
        if (predictions.length === 0) {
            return res.status(400).json({ message: "predictions 배열이 비어 있습니다." });
        }
        // ✨ riskScore 기준 정렬
        const sorted = [...predictions].sort((a, b) => b.riskScore - a.riskScore);
        yield recordService.savePredictionResult(recordId, sorted[0], sorted[1], sorted[2]);
        res.status(201).json({ message: "예측 결과 저장 완료" });
    }
    catch (err) {
        console.error("❌ 예측 결과 저장 실패:", (err === null || err === void 0 ? void 0 : err.message) || err);
        res.status(500).json({ message: "서버 에러" });
    }
});
exports.savePredictions = savePredictions;
