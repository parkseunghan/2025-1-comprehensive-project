// 🔹 medication.controller.ts
// 이 파일은 '복용약(Medication)' 관련 API 요청을 처리하는 Express 컨트롤러 계층입니다.

import { Request, Response } from "express";
import * as medicationService from "../services/medication.service";

/**
 * 전체 약물 목록을 조회합니다.
 * GET /medications
 */
export const getAllMedications = async (req: Request, res: Response) => {
  try {
    const result = await medicationService.findAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "약물 목록 조회 중 오류가 발생했습니다." });
  }
};

/**
 * 특정 ID로 약물을 조회합니다.
 * GET /medications/:id
 */
export const getMedicationById = async (req: Request, res: Response) => {
  try {
    const medication = await medicationService.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: "약물을 찾을 수 없습니다." });
    }
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: "약물 조회 중 오류가 발생했습니다." });
  }
};

/**
 * 사용자 ID로 해당 사용자의 약물 목록을 조회합니다.
 * GET /users/:userId/medications
 */
export const getUserMedications = async (req: Request, res: Response) => {
  try {
    const result = await medicationService.findByUserId(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "사용자 약물 조회 중 오류가 발생했습니다." });
  }
};

/**
 * 사용자에게 약물을 추가합니다.
 * POST /users/:userId/medications
 */
export const addUserMedication = async (req: Request, res: Response) => {
  const { medicationId } = req.body;

  if (!medicationId) {
    return res.status(400).json({ message: "medicationId가 필요합니다." });
  }

  try {
    const result = await medicationService.addMedicationToUser(req.params.userId, medicationId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "약물 추가 중 오류가 발생했습니다." });
  }
};

/**
 * 사용자의 약물을 삭제합니다.
 * DELETE /users/:userId/medications/:medicationId
 */
export const deleteUserMedication = async (req: Request, res: Response) => {
  const { userId, medicationId } = req.params;

  try {
    const result = await medicationService.removeMedicationFromUser(userId, medicationId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "약물 삭제 중 오류가 발생했습니다." });
  }
};
