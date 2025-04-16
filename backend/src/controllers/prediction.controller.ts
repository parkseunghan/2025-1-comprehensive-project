// 📄 prediction.controller.ts
// AI 예측 전체 흐름 컨트롤러 (LLM 증상 추출 → 파이썬 모델 실행 → DB 저장 → 응답 반환)

import { Request, Response } from "express";
import { extractSymptoms } from "../services/llm.service";
import { runPredictionModel } from "../services/prediction.service";
import { savePredictionResult, saveSymptomsToRecord } from "../services/record.service";
import prisma from "../config/prisma.service";

/**
 * 예측 생성 - 자연어 입력 기반으로 AI 예측 수행
 * POST /symptom-records/:recordId/prediction
 */
export const createPrediction = async (req: Request, res: Response) => {
    try {
        const { symptom_text } = req.body;
        const { recordId } = req.params;

        if (!req.user?.id) {
            res.status(401).json({ message: "인증된 사용자가 없습니다." });
            return;
        }

        // 1️⃣ 증상 + 시간 정보 추출
        const extracted = await extractSymptoms(symptom_text);

        // 2️⃣ DB에 증상 기록 저장 (timeOfDay 포함)
        await saveSymptomsToRecord(recordId, extracted);

        // 3️⃣ 증상 키워드만 추출하여 모델 예측 수행
        const symptomKeywords = extracted.map((item) => item.symptom);
        const predictionResult = await runPredictionModel({
            userId: req.user.id,
            symptomKeywords,
        });

        // 4️⃣ 예측 결과 저장
        await savePredictionResult(recordId, predictionResult);
        res.status(200).json(predictionResult);
        return;
    } catch (error) {
        console.error("[createPrediction] 예측 생성 오류:", error);
        res.status(500).json({ message: "예측 생성 중 오류 발생" });
        return;
    }
};

/**
 * 예측 조회 - 특정 기록의 예측 결과 반환
 * GET /symptom-records/:recordId/prediction
 */
export const getPredictionByRecord = async (req: Request, res: Response) => {
    try {
        const { recordId } = req.params;

        const prediction = await prisma.prediction.findUnique({
            where: { recordId },
        });

        if (!prediction) {
            res.status(404).json({ message: "예측 결과가 존재하지 않습니다." });
            return;
        }

        res.status(200).json(prediction);
        return;
    } catch (error) {
        console.error("[getPredictionByRecord] 오류:", error);
        res.status(500).json({ message: "예측 결과 조회 실패" });
        return;
    }
};

/**
 * 예측 삭제
 * DELETE /symptom-records/:recordId/prediction
 */
export const deletePrediction = async (req: Request, res: Response) => {
    try {
        const { recordId } = req.params;

        await prisma.prediction.delete({
            where: { recordId },
        });

        res.status(204).send();
        return;
    } catch (error) {
        console.error("[deletePrediction] 삭제 오류:", error);
        res.status(500).json({ message: "예측 삭제 실패" });
        return;
    }
};

/**
 * 예측 재요청 - 기존 예측 삭제 후 다시 생성
 * POST /symptom-records/:recordId/prediction/retry
 */
export const recreatePrediction = async (req: Request, res: Response) => {
    try {
        const { recordId } = req.params;
        const { symptom_text } = req.body;

        if (!req.user?.id) {
            res.status(401).json({ message: "인증된 사용자가 없습니다." });
            return;
        }

        await prisma.prediction.deleteMany({ where: { recordId } });

        const extracted = await extractSymptoms(symptom_text);
        await saveSymptomsToRecord(recordId, extracted);

        const symptomKeywords = extracted.map((item) => item.symptom);
        const predictionResult = await runPredictionModel({
            userId: req.user.id,
            symptomKeywords,
        });

        await savePredictionResult(recordId, predictionResult);
        res.status(200).json(predictionResult);
        return;
    } catch (error) {
        console.error("[recreatePrediction] 오류:", error);
        res.status(500).json({ message: "예측 재요청 실패" });
        return;
    }
};