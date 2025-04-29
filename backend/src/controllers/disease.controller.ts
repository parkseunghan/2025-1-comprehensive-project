// 🔹 disease.controller.ts
// 이 파일은 '지병(Disease)' 관련 API 요청을 처리하는 Express 컨트롤러 계층입니다.

import { Request, Response } from "express";
import * as diseaseService from "../services/disease.service";

/**
 * 전체 질병 조회 API
 * GET /api/diseases
 */
export const getAllDiseases = async (req: Request, res: Response) => {
  const diseases = await diseaseService.getAllDiseases();
  res.status(200).json(diseases);
};
/**
 * 특정 ID로 지병을 조회합니다.
 * GET /diseases/:id
 */
export const getDiseaseById = async (req: Request, res: Response) => {
  const disease = await diseaseService.findById(req.params.id);
  if (!disease) {
    res.status(404).json({ message: "지병을 찾을 수 없습니다." });
    return;
  }
  res.json(disease);
};

/**
 * 사용자 ID로 해당 사용자의 지병 목록을 조회합니다.
 * GET /users/:userId/diseases
 */
export const getUserDiseases = async (req: Request, res: Response) => {
  const result = await diseaseService.findByUserId(req.params.userId);
  res.json(result);
};

/**
 * 사용자에게 지병을 추가합니다.
 * POST /users/:userId/diseases
 */
export const addUserDisease = async (req: Request, res: Response) => {
  const { diseaseId } = req.body;

  if (!diseaseId) {
    res.status(400).json({ message: "diseaseId가 필요합니다." });
    return;
  }

  const result = await diseaseService.addDiseaseToUser(req.params.userId, diseaseId);
  res.status(201).json(result);
};

/**
 * 사용자의 지병을 삭제합니다.
 * DELETE /users/:userId/diseases/:diseaseId
 */
export const deleteUserDisease = async (req: Request, res: Response) => {
  const { userId, diseaseId } = req.params;
  const result = await diseaseService.removeDiseaseFromUser(userId, diseaseId);
  res.json(result);
};
