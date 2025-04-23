// 📄 src/controllers/prediction.controller.ts

import { Request, Response } from "express";
import { requestPrediction } from "../services/prediction.service";

/**
 * POST /api/prediction
 * AI 서버에 증상 데이터를 보내고 예측 결과를 반환합니다.
 */
export const predictFromAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await requestPrediction(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("AI 예측 오류:", error.message);
    res.status(500).json({ message: "AI 예측 실패", error: error.message });
  }
};
