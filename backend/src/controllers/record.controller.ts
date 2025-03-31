// 🔹 record.controller.ts
// 이 파일은 증상 기록(SymptomRecord)에 대한 요청을 처리하는 컨트롤러 계층입니다.
// 사용자 증상 기록 생성, 조회, 삭제 기능을 담당합니다.

import { Request, Response } from "express";
import * as recordService from "../services/record.service";

/**
 * 사용자 증상 기록 생성
 * POST /users/:userId/symptom-records
 */
export const createSymptomRecord = async (req: Request, res: Response) => {
  const { symptomIds } = req.body;

  if (!Array.isArray(symptomIds) || symptomIds.length === 0) {
    res.status(400).json({ message: "증상 ID 배열이 필요합니다." });
    return;
  }

  const result = await recordService.create(req.params.userId, symptomIds);
  res.status(201).json(result);
};

/**
 * 특정 사용자의 증상 기록 전체 조회
 * GET /users/:userId/symptom-records
 */
export const getSymptomRecordsByUser = async (req: Request, res: Response) => {
  const result = await recordService.findByUserId(req.params.userId);
  res.json(result);
};

/**
 * 특정 증상 기록 ID로 조회
 * GET /symptom-records/:id
 */
export const getSymptomRecordById = async (req: Request, res: Response) => {
  const record = await recordService.findById(req.params.id);
  if (!record) {
    res.status(404).json({ message: "증상 기록을 찾을 수 없습니다." });
    return;
  }
  res.json(record);
};

/**
 * 특정 증상 기록 삭제
 * DELETE /symptom-records/:id
 */
export const deleteSymptomRecord = async (req: Request, res: Response) => {
  const result = await recordService.remove(req.params.id);
  if (!result) {
    res.status(404).json({ message: "증상 기록을 찾을 수 없습니다." });
    return;
  }
  res.json(result);
};