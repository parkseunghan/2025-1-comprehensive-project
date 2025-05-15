// 📄 prediction.controller.ts
// AI 예측 요청 및 예측 결과 저장을 처리하는 컨트롤러입니다.

import { Request, Response } from "express";
import axios from "axios";
import { config } from "dotenv";
import * as predictionService from "../services/prediction.service";
import * as recordService from "../services/record.service";
import { PredictionCandidate } from "../types/prediction.types";
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

    // 필수 입력 검증
    if (!symptomKeywords || !Array.isArray(symptomKeywords)) {
      res.status(400).json({ message: "symptomKeywords가 필요합니다." });
      return;
    }

    // ✅ 증상 개수 검사
    if (symptomKeywords.length < 2) {
      res.status(400).json({
        message: "❗ 입력하신 증상이 너무 적습니다. 증상을 좀 더 구체적으로 입력해주세요.",
      });
      return;
    }

    // ✅ 디버깅 로그
    console.log("📦 [predictFromAI] 요청 수신:", req.body);

    // AI 서버에 요청 보내기
    const aiRes = await axios.post(`${process.env.AI_API_URL}/predict`, {
      symptom_keywords: symptomKeywords,
      age,
      gender,
      height,
      weight,
      bmi,
      chronic_diseases: diseases,
      medications,
    });

    res.status(200).json(aiRes.data);
  } catch (error: any) {
    console.error("❌ AI 예측 오류:", error.message);
    res.status(500).json({ message: "AI 예측 실패", error: error.message });
  }
};

/**
 * GET /api/prediction/:recordId
 * 증상 기록 ID로 예측 결과를 조회합니다.
 */
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
 * POST /api/prediction/symptom-records/:recordId/prediction
 * 예측 결과 배열을 저장합니다. Top-1은 Prediction 모델, 나머지는 PredictionRank 모델로 저장합니다.
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

    // ✨ riskScore 기준 내림차순 정렬
    const sorted: PredictionCandidate[] = [...predictions].sort((a, b) => b.riskScore - a.riskScore);

    // 예측 결과 저장
    await recordService.savePredictionResult(recordId, sorted);

    res.status(201).json({ message: "예측 결과 저장 완료" });
  } catch (err) {
    console.error("❌ 예측 결과 저장 실패:", (err as any)?.message || err);
    res.status(500).json({ message: "서버 에러" });
  }
};

/**
 * GET /api/prediction/stats
 * 로그인한 사용자의 예측 결과 목록을 반환합니다.
 */
export const getPredictionStats = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "인증된 사용자만 접근할 수 있습니다." });
    }

    const userId = req.user.id;
    const stats = await predictionService.getPredictionStats(userId);

    res.status(200).json(stats);
  } catch (err) {
    console.error("❌ 통계 데이터 조회 오류:", err);
    res.status(500).json({ message: "통계 데이터를 불러오는 중 오류가 발생했습니다." });
  }
};
