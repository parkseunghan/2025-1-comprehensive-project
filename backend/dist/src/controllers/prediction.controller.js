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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictFromAI = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // .env 로드
/**
 * POST /api/prediction
 * AI 서버에 증상 데이터를 보내고 예측 결과를 반환합니다.
 */
const predictFromAI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symptomKeywords, age, gender, height, weight, bmi, chronicDiseases, medications, } = req.body;
        // ✅ 디버깅 로그
        console.log("📦 [predictFromAI] 요청 수신:");
        console.log("  - gender:", gender);
        console.log("  - age:", age);
        console.log("  - height:", height);
        console.log("  - weight:", weight);
        console.log("  - bmi:", bmi);
        console.log("  - symptomKeywords:", symptomKeywords);
        console.log("  - chronicDiseases:", chronicDiseases);
        console.log("  - medications:", medications);
        console.log("  - raw req.body:", req.body); // 👈 추가 로그
        if (!symptomKeywords || !Array.isArray(symptomKeywords)) {
            res.status(400).json({ message: "symptomKeywords가 필요합니다." });
            return;
        }
        const aiRes = yield axios_1.default.post(`${process.env.AI_API_URL}/predict`, {
            symptom_keywords: symptomKeywords,
            age,
            gender,
            height,
            weight,
            bmi,
            chronic_diseases: chronicDiseases,
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
