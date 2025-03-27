// 🔹 disease.controller.ts
// 이 파일은 '지병(Disease)' 관련 API 요청을 처리하는 Express 컨트롤러 계층입니다.
// 요청 데이터를 파싱하고, 서비스 로직을 호출하며, 응답을 반환합니다.

import { Request, Response } from "express";
import * as diseaseService from "../services/disease.service";

/**
 * 전체 지병 목록을 조회합니다.
 * GET /diseases
 */
export const getAllDiseases = (req: Request, res: Response): void => {
  const result = diseaseService.findAll(); // 전체 지병 데이터 조회
  res.json(result); // 결과 반환
};

/**
 * 특정 ID로 지병을 조회합니다.
 * GET /diseases/:id
 */
export const getDiseaseById = (req: Request, res: Response): void => {
  const disease = diseaseService.findById(req.params.id); // ID로 검색
  if (!disease) {
    res.status(404).json({ message: "Not found" }); // 없으면 404
  } else {
    res.json(disease); // 결과 반환
  }
};

/**
 * 사용자 ID로 해당 사용자의 지병 목록을 조회합니다.
 * GET /users/:userId/diseases
 */
export const getUserDiseases = (req: Request, res: Response): void => {
  const result = diseaseService.findByUserId(req.params.userId); // userId로 검색
  res.json(result); // 결과 반환
};

/**
 * 사용자에게 지병을 추가합니다.
 * POST /users/:userId/diseases
 */
export const addUserDisease = (req: Request, res: Response): void => {
  const { diseaseId } = req.body; // body에서 diseaseId 추출
  const result = diseaseService.addDiseaseToUser(req.params.userId, diseaseId); // 서비스 호출
  res.status(201).json(result); // 201 Created 반환
};

/**
 * 사용자의 지병을 삭제합니다.
 * DELETE /users/:userId/diseases/:diseaseId
 */
export const deleteUserDisease = (req: Request, res: Response): void => {
  const result = diseaseService.removeDiseaseFromUser(req.params.userId, req.params.diseaseId); // 관계 제거
  res.json(result); // 결과 반환
};
