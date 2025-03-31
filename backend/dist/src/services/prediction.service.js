"use strict";
// 🔹 prediction.service.ts
// 이 파일은 예측(Prediction) 관련 비즈니스 로직을 담당하는 서비스 계층입니다.
// Prisma를 통해 증상 기록 기반 예측 생성 및 조회를 처리합니다.
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
exports.findByRecordId = exports.create = void 0;
const prisma_service_1 = __importDefault(require("../config/prisma.service"));
/** 예측 생성 (더미 결과 기반) */
const create = (recordId) => __awaiter(void 0, void 0, void 0, function* () {
    // 이미 예측된 기록인지 확인
    const existing = yield prisma_service_1.default.prediction.findUnique({
        where: { recordId },
    });
    if (existing)
        return { message: "이미 예측이 생성되었습니다." };
    // 예측 생성
    return yield prisma_service_1.default.prediction.create({
        data: {
            recordId,
            result: "감기", // ✅ 더미 데이터
            confidence: 0.91,
            guideline: "수분 섭취와 휴식을 충분히 취하세요.",
        },
    });
});
exports.create = create;
/** 증상 기록 ID로 예측 결과 조회 */
const findByRecordId = (recordId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.default.prediction.findUnique({
        where: { recordId },
    });
});
exports.findByRecordId = findByRecordId;
