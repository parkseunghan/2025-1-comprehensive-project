"use strict";
// 📄 src/controllers/prediction.controller.ts
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
exports.predictFromAI = void 0;
const prediction_service_1 = require("../services/prediction.service");
/**
 * POST /api/prediction
 * AI 서버에 증상 데이터를 보내고 예측 결과를 반환합니다.
 */
const predictFromAI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, prediction_service_1.requestPrediction)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("AI 예측 오류:", error.message);
        res.status(500).json({ message: "AI 예측 실패", error: error.message });
    }
});
exports.predictFromAI = predictFromAI;
