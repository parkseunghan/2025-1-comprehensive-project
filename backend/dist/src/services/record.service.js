"use strict";
// 📄 record.service.ts
// 예측 결과와 증상 + 시간 정보를 Prisma를 통해 DB에 저장하는 서비스
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
exports.saveSymptomsToRecord = exports.savePredictionResult = void 0;
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 예측 결과 저장
 */
const savePredictionResult = (recordId, result) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    yield prisma_service_1.default.prediction.create({
        data: {
            recordId: recordId,
            coarseLabel: result.coarse_label,
            riskScore: result.risk_score,
            riskLevel: result.risk_level,
            guideline: result.recommendation,
            elapsedSec: result.elapsed,
            top1: (_b = (_a = result.top_predictions[0]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : null,
            top1Prob: (_d = (_c = result.top_predictions[0]) === null || _c === void 0 ? void 0 : _c.prob) !== null && _d !== void 0 ? _d : null,
            top2: (_f = (_e = result.top_predictions[1]) === null || _e === void 0 ? void 0 : _e.label) !== null && _f !== void 0 ? _f : null,
            top2Prob: (_h = (_g = result.top_predictions[1]) === null || _g === void 0 ? void 0 : _g.prob) !== null && _h !== void 0 ? _h : null,
            top3: (_k = (_j = result.top_predictions[2]) === null || _j === void 0 ? void 0 : _j.label) !== null && _k !== void 0 ? _k : null,
            top3Prob: (_m = (_l = result.top_predictions[2]) === null || _l === void 0 ? void 0 : _l.prob) !== null && _m !== void 0 ? _m : null,
        },
    });
});
exports.savePredictionResult = savePredictionResult;
/**
 * 증상 + 시간 정보 저장
 */
const saveSymptomsToRecord = (recordId, symptoms) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 기존 증상 모두 삭제
    yield prisma_service_1.default.symptomOnRecord.deleteMany({ where: { recordId } });
    for (const item of symptoms) {
        // 증상명이 존재하는 경우 연결 (이미 등록된 Symptom 테이블 기준)
        const symptom = yield prisma_service_1.default.symptom.findUnique({
            where: { name: item.symptom },
        });
        if (symptom) {
            yield prisma_service_1.default.symptomOnRecord.create({
                data: {
                    recordId,
                    symptomId: symptom.id,
                    timeOfDay: (_a = item.time) !== null && _a !== void 0 ? _a : null,
                },
            });
        }
    }
});
exports.saveSymptomsToRecord = saveSymptomsToRecord;
