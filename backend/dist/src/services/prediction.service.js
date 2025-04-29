"use strict";
// 📄 src/services/prediction.service.ts
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
exports.findByRecord = exports.save = void 0;
exports.requestPrediction = requestPrediction;
const axios_1 = __importDefault(require("../utils/axios")); // 공통 axios 인스턴스
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * AI 서버에 증상 데이터를 보내고 예측 결과를 받아옵니다.
 * @param data 예측 요청 데이터
 * @returns 예측 응답 데이터
 * @throws 서버 오류 또는 예측 실패 시 에러
 */
function requestPrediction(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🚀 [Axios] 예측 요청 전송 중...");
            console.log("📡 보낼 데이터:", data); // ✅ 전송 데이터 확인용
            const response = yield axios_1.default.post("/predict", data);
            console.log("✅ [Axios] 응답 도착:", response.data); // ✅ 응답 데이터 확인용
            return response.data;
        }
        catch (error) {
            console.error("❌ [requestPrediction] AI 서버 요청 실패:", error.message);
            throw new Error("AI 예측 요청 중 오류가 발생했습니다."); // 프론트에서 에러 핸들링할 수 있게 throw
        }
    });
}
/**
 * 🔹 예측 결과 저장
 */
const save = (recordId, predictions) => __awaiter(void 0, void 0, void 0, function* () {
    const prediction = predictions[0]; // 가장 높은 확률의 예측 사용
    return yield prisma.prediction.create({
        data: {
            recordId,
            coarseLabel: prediction.coarseLabel,
            fineLabel: prediction.fineLabel || prediction.coarseLabel,
            riskScore: prediction.riskScore,
            riskLevel: prediction.riskLevel,
            guideline: prediction.guideline,
        },
    });
});
exports.save = save;
/**
 * 🔹 예측 결과 조회
 */
const findByRecord = (recordId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.prediction.findFirst({
        where: { recordId },
    });
});
exports.findByRecord = findByRecord;
