// 🔹 prediction.controller.ts
// 이 파일은 예측(Prediction) API 요청을 처리하는 컨트롤러입니다.
// 증상 기록에 대한 예측 생성 및 조회 기능을 담당합니다.

import { Request, Response } from "express";
import * as predictionService from "../services/prediction.service";

/**
 * 예측 결과 생성 (모델 연결 전 더미 기반)
 * POST /symptom-records/:recordId/prediction
 */
export const createPrediction = (req: Request, res: Response): void => {
  const result = predictionService.create(req.params.recordId); // 예측 생성
  res.status(201).json(result);
};

/**
 * 특정 증상 기록에 대한 예측 결과 조회
 * GET /symptom-records/:recordId/prediction
 */
export const getPredictionByRecord = (req: Request, res: Response): void => {
  const result = predictionService.findByRecordId(req.params.recordId); // 예측 찾기
  if (!result) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.json(result);
  }
};
