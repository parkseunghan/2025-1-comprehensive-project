// 🔹 symptom.controller.ts
// 이 파일은 '증상(Symptom)' 관련 API 요청을 처리하는 Express 컨트롤러입니다.
// 증상 목록 조회 및 개별 증상 조회 기능을 제공합니다.

import { Request, Response } from "express";
import * as symptomService from "../services/symptom.service";

/**
 * 전체 증상 목록을 조회합니다.
 * GET /symptoms
 */
export const getAllSymptoms = (req: Request, res: Response): void => {
  const result = symptomService.findAll(); // 모든 증상 반환
  res.json(result); // JSON 응답
};

/**
 * 특정 증상 ID로 증상을 조회합니다.
 * GET /symptoms/:id
 */
export const getSymptomById = (req: Request, res: Response): void => {
  const symptom = symptomService.findById(req.params.id); // ID로 검색
  if (!symptom) {
    res.status(404).json({ message: "Not found" }); // 없음 처리
  } else {
    res.json(symptom); // 결과 반환
  }
};
