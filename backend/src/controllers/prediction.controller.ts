// 📄 prediction.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import { config } from "dotenv";
import * as predictionService from "../services/prediction.service";
import * as recordService from "../services/record.service";
config(); // .env 환경변수 로드

/**
 * POST /api/prediction
 * AI 서버에 증상 데이터를 보내고 예측 결과를 반환합니다.
 */
export const predictFromAI = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            symptomKeywords,
            age,
            gender,
            height,
            weight,
            bmi,
            diseases,
            medications,
        } = req.body;

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
        const aiRes = await axios.post(`${process.env.AI_API_URL}/predict`, {
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
    } catch (error: any) {
        console.error("❌ AI 예측 오류:", error.message);
        res.status(500).json({ message: "AI 예측 실패", error: error.message });
    }
};

export const getPredictionByRecord = async (req: Request, res: Response) => {
    try {
        const { recordId } = req.params;
        const result = await predictionService.findByRecord(recordId);

        if (!result) {
            res.status(404).json({ message: "예측 결과를 찾을 수 없습니다." });
            return;
        }

        res.json(result);
    } catch (err) {
        console.error("❌ 예측 결과 조회 오류:", err);
        res.status(500).json({ message: "예측 결과 조회 중 오류가 발생했습니다." });
    }
};

/**
 * 증상 기록 기반 예측 결과 저장
 * POST /api/prediction/symptom-records/:recordId/prediction
 */
export const savePredictions = async (req: Request, res: Response) => {
    try {
        const { recordId } = req.params;
        const { predictions } = req.body;

        if (!predictions || !Array.isArray(predictions)) {
            res.status(400).json({ message: "predictions 배열이 필요합니다." });
            return;
        }

        if (predictions.length === 0) {
            res.status(400).json({ message: "predictions 배열이 비어 있습니다." });
            return;
        }

        // ✨ riskScore 기준 정렬
        const sorted = [...predictions].sort((a, b) => b.riskScore - a.riskScore);

        await recordService.savePredictionResult(
            recordId,
            sorted[0],
            sorted[1],
            sorted[2]
        );

        res.status(201).json({ message: "예측 결과 저장 완료" });
    } catch (err) {
        console.error("❌ 예측 결과 저장 실패:", (err as any)?.message || err);
        res.status(500).json({ message: "서버 에러" });
    }
};
