// 🔹 symptom.controller.ts
// 이 파일은 '증상(Symptom)' 관련 API 요청을 처리하는 Express 컨트롤러입니다.
// 증상 목록 조회 및 개별 증상 조회 기능을 제공합니다.

import { Request, Response } from "express";
import * as symptomService from "../services/symptom.service";

/**
 * 전체 증상 목록을 조회합니다.
 * GET /symptoms
 */
export const getAllSymptoms = async (req: Request, res: Response) => {
  const result = await symptomService.findAll();
  res.json(result);
};


/**
 * 특정 증상 ID로 증상을 조회합니다.
 * GET /symptoms/:id
 */
export const getSymptomById = async (req: Request, res: Response) => {
  const symptom = await symptomService.findById(req.params.id);
  if (!symptom) {
    res.status(404).json({ message: "증상을 찾을 수 없습니다." });
    return;
  }
  res.json(symptom);
};
