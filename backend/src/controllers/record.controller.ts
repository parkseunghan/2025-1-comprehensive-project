// 🔹 record.controller.ts
// 이 파일은 증상 기록(SymptomRecord)에 대한 요청을 처리하는 컨트롤러 계층입니다.
// 사용자 증상 기록 생성, 조회, 삭제 기능을 담당합니다.

import { Request, Response } from "express";
import * as recordService from "../services/record.service";

/**
 * 사용자 증상 기록 생성
 * POST /users/:userId/symptom-records
 */
export const createSymptomRecord = (req: Request, res: Response): void => {
  const { symptomIds } = req.body; // 증상 ID 배열 추출
  const result = recordService.create(req.params.userId, symptomIds); // 생성 요청
  res.status(201).json(result); // 생성된 기록 반환
};

/**
 * 특정 사용자의 증상 기록 전체 조회
 * GET /users/:userId/symptom-records
 */
export const getSymptomRecordsByUser = (req: Request, res: Response): void => {
  const result = recordService.findByUserId(req.params.userId); // 사용자 기준 필터링
  res.json(result);
};

/**
 * 특정 증상 기록 ID로 조회
 * GET /symptom-records/:id
 */
export const getSymptomRecordById = (req: Request, res: Response): void => {
  const result = recordService.findById(req.params.id); // ID로 찾기
  if (!result) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.json(result);
  }
};

/**
 * 특정 증상 기록 삭제
 * DELETE /symptom-records/:id
 */
export const deleteSymptomRecord = (req: Request, res: Response): void => {
  const result = recordService.remove(req.params.id); // 삭제 요청
  res.json(result);
};
