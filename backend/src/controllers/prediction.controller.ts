// 🔹 prediction.controller.ts
// 이 파일은 예측(Prediction) API 요청을 처리하는 컨트롤러입니다.
// 증상 기록에 대한 예측 생성 및 조회 기능을 담당합니다.

import { Request, Response } from "express";
import * as predictionService from "../services/prediction.service";
import prisma from "../config/prisma.service";

/**
 * 예측 결과 생성 (모델 연결 전 더미 기반)
 * POST /symptom-records/:recordId/prediction
 */
export const createPrediction = async (req: Request, res: Response) => {
  const { recordId } = req.params;

  // ✅ 증상 기록이 존재하는지 확인
  const record = await prisma.symptomRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    res.status(404).json({ message: "증상 기록을 찾을 수 없습니다." });
    return;
  }

  const result = await predictionService.create(recordId);
  res.status(201).json(result);
};

/**
 * 특정 증상 기록에 대한 예측 결과 조회
 * GET /symptom-records/:recordId/prediction
 */
export const getPredictionByRecord = async (req: Request, res: Response) => {
  const result = await predictionService.findByRecordId(req.params.recordId);

  if (!result) {
    res.status(404).json({ message: "예측 결과를 찾을 수 없습니다." });
    return;
  }

  res.json(result);
};

/** 예측 삭제 */
export const deletePrediction = async (req: Request, res: Response) => {
  const deleted = await predictionService.remove(req.params.recordId);
  if (!deleted) {
    res.status(404).json({ message: "예측을 찾을 수 없습니다." });
    return;
  }
  res.json(deleted);
};

/** 예측 재요청 (삭제되어도 새로 생성) */
export const recreatePrediction = async (req: Request, res: Response) => {
  const { recordId } = req.params;

  const record = await prisma.symptomRecord.findUnique({ where: { id: recordId } });
  if (!record) {
    res.status(404).json({ message: "증상 기록을 찾을 수 없습니다." });
    return;
  }

  // 기존 예측 삭제
  await predictionService.remove(recordId);

  // 새 예측 생성
  const result = await predictionService.create(recordId);
  res.status(201).json(result);
};