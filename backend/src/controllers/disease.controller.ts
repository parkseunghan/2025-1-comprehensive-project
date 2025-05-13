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
  const disease = await diseaseService.findBySickCode(req.params.id);
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

/**
 * 🔍 질병 이름으로 설명/팁 조회 (Prisma 기반)
 * GET /diseases/info-by-name?name=기관지 천식
 */
export const getDiseaseInfoByName = async (req: Request, res: Response) => {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    res.status(400).json({ message: "name 파라미터가 필요합니다." });
    return;
  }

  try {
    const disease = await diseaseService.findByName(name);

    if (!disease) {
      res.status(404).json({ message: "해당 질병 정보가 없습니다." });
      return;
    }

    res.json({
      name: disease.name,
      description: disease.description,
      tips: disease.tips,
    });
  } catch (error) {
    console.error("❌ DB에서 질병 정보 조회 실패:", error);
    res.status(500).json({ message: "질병 정보 조회 중 서버 오류" });
  }
};
