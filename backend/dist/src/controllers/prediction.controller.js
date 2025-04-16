"use strict";
// 📄 prediction.controller.ts
// AI 예측 전체 흐름 컨트롤러 (LLM 증상 추출 → 파이썬 모델 실행 → DB 저장 → 응답 반환)
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
const llm_service_1 = require("../services/llm.service");
const prediction_service_1 = require("../services/prediction.service");
const record_service_1 = require("../services/record.service");
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 예측 생성 - 자연어 입력 기반으로 AI 예측 수행
 * POST /symptom-records/:recordId/prediction
 */
const createPrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { symptom_text } = req.body;
        const { recordId } = req.params;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: "인증된 사용자가 없습니다." });
            return;
        }
        // 1️⃣ 증상 + 시간 정보 추출
        const extracted = yield (0, llm_service_1.extractSymptoms)(symptom_text);
        // 2️⃣ DB에 증상 기록 저장 (timeOfDay 포함)
        yield (0, record_service_1.saveSymptomsToRecord)(recordId, extracted);
        // 3️⃣ 증상 키워드만 추출하여 모델 예측 수행
        const symptomKeywords = extracted.map((item) => item.symptom);
        const predictionResult = yield (0, prediction_service_1.runPredictionModel)({
            userId: req.user.id,
            symptomKeywords,
        });
        // 4️⃣ 예측 결과 저장
        yield (0, record_service_1.savePredictionResult)(recordId, predictionResult);
        res.status(200).json(predictionResult);
        return;
    }
    catch (error) {
        console.error("[createPrediction] 예측 생성 오류:", error);
        res.status(500).json({ message: "예측 생성 중 오류 발생" });
        return;
    }
});
exports.createPrediction = createPrediction;
/**
 * 예측 조회 - 특정 기록의 예측 결과 반환
 * GET /symptom-records/:recordId/prediction
 */
const getPredictionByRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recordId } = req.params;
        const prediction = yield prisma_service_1.default.prediction.findUnique({
            where: { recordId },
        });
        if (!prediction) {
            res.status(404).json({ message: "예측 결과가 존재하지 않습니다." });
            return;
        }
        res.status(200).json(prediction);
        return;
    }
    catch (error) {
        console.error("[getPredictionByRecord] 오류:", error);
        res.status(500).json({ message: "예측 결과 조회 실패" });
        return;
    }
});
exports.getPredictionByRecord = getPredictionByRecord;
/**
 * 예측 삭제
 * DELETE /symptom-records/:recordId/prediction
 */
const deletePrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recordId } = req.params;
        yield prisma_service_1.default.prediction.delete({
            where: { recordId },
        });
        res.status(204).send();
        return;
    }
    catch (error) {
        console.error("[deletePrediction] 삭제 오류:", error);
        res.status(500).json({ message: "예측 삭제 실패" });
        return;
    }
});
exports.deletePrediction = deletePrediction;
/**
 * 예측 재요청 - 기존 예측 삭제 후 다시 생성
 * POST /symptom-records/:recordId/prediction/retry
 */
const recreatePrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { recordId } = req.params;
        const { symptom_text } = req.body;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: "인증된 사용자가 없습니다." });
            return;
        }
        yield prisma_service_1.default.prediction.deleteMany({ where: { recordId } });
        const extracted = yield (0, llm_service_1.extractSymptoms)(symptom_text);
        yield (0, record_service_1.saveSymptomsToRecord)(recordId, extracted);
        const symptomKeywords = extracted.map((item) => item.symptom);
        const predictionResult = yield (0, prediction_service_1.runPredictionModel)({
            userId: req.user.id,
            symptomKeywords,
        });
        yield (0, record_service_1.savePredictionResult)(recordId, predictionResult);
        res.status(200).json(predictionResult);
        return;
    }
    catch (error) {
        console.error("[recreatePrediction] 오류:", error);
        res.status(500).json({ message: "예측 재요청 실패" });
        return;
    }
});
exports.recreatePrediction = recreatePrediction;
