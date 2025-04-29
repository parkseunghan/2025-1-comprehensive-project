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
exports.saveSymptomsToRecord = exports.savePredictionResult = exports.remove = exports.findById = exports.findByUserId = exports.create = void 0;
exports.calculateRiskLevel = calculateRiskLevel;
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/**
 * 진단 기록 생성
 */
const create = (userId, symptomIds) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield prisma_service_1.default.symptomRecord.create({
        data: { userId },
    });
    for (const id of symptomIds) {
        const symptom = yield prisma_service_1.default.symptom.findUnique({ where: { id } });
        if (symptom) {
            yield prisma_service_1.default.symptomOnRecord.create({
                data: {
                    recordId: record.id,
                    symptomId: symptom.id,
                    timeOfDay: null, // 나중에 시간 정보 받을 수 있도록 확장 가능
                },
            });
        }
    }
    return record;
});
exports.create = create;
/**
 * 사용자별 진단 기록 조회
 */
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_service_1.default.symptomRecord.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            prediction: true,
            symptoms: {
                include: { symptom: true },
            },
        },
    });
});
exports.findByUserId = findByUserId;
/**
 * 특정 진단 기록 상세 조회
 */
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_service_1.default.symptomRecord.findUnique({
        where: { id },
        include: {
            prediction: true,
            symptoms: {
                include: { symptom: true },
            },
        },
    });
});
exports.findById = findById;
/**
 * 진단 기록 삭제
 */
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_service_1.default.symptomRecord.delete({
        where: { id },
    });
});
exports.remove = remove;
/**
 * 위험 점수(riskScore)를 기반으로 위험도 등급(riskLevel)을 계산합니다.
 * @param riskScore 위험 점수 (0.0 ~ 1.0 사이 값)
 * @returns 위험도 등급 ("낮음", "보통", "높음", "응급")
 */
function calculateRiskLevel(riskScore) {
    if (riskScore >= 0.8)
        return "응급";
    if (riskScore >= 0.6)
        return "높음";
    if (riskScore >= 0.4)
        return "보통";
    return "낮음";
}
/**
 * 위험도 등급에 따라 기본 대응 가이드를 생성합니다.
 */
function generateGuideline(riskLevel) {
    if (riskLevel === "응급")
        return "즉시 응급실 방문이 필요합니다.";
    if (riskLevel === "높음")
        return "가까운 병원 방문을 권장합니다.";
    if (riskLevel === "보통")
        return "증상을 경과 관찰하고 심화 시 병원을 방문하세요.";
    return "생활 관리를 통해 주의하세요.";
}
/**
 * 예측 결과 저장
 */
const savePredictionResult = (recordId, top1, top2, top3) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    yield prisma_service_1.default.prediction.create({
        data: {
            recordId,
            coarseLabel: top1.coarseLabel,
            fineLabel: top1.fineLabel,
            riskScore: top1.riskScore,
            riskLevel: top1.riskLevel,
            guideline: top1.guideline,
            top1: top1.fineLabel,
            top1Prob: top1.riskScore,
            top2: (_a = top2 === null || top2 === void 0 ? void 0 : top2.fineLabel) !== null && _a !== void 0 ? _a : null,
            top2Prob: (_b = top2 === null || top2 === void 0 ? void 0 : top2.riskScore) !== null && _b !== void 0 ? _b : null,
            top3: (_c = top3 === null || top3 === void 0 ? void 0 : top3.fineLabel) !== null && _c !== void 0 ? _c : null,
            top3Prob: (_d = top3 === null || top3 === void 0 ? void 0 : top3.riskScore) !== null && _d !== void 0 ? _d : null,
        },
    });
});
exports.savePredictionResult = savePredictionResult;
/**
 * 증상 + 시간 정보 저장
 */
const saveSymptomsToRecord = (recordId, symptoms) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield prisma_service_1.default.symptomOnRecord.deleteMany({ where: { recordId } });
    for (const item of symptoms) {
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
