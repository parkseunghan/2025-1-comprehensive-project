// 🔹 user.controller.ts
// 이 파일은 사용자 API 요청을 처리하는 컨트롤러 계층입니다.
// 요청 데이터를 파싱하고, 서비스 로직을 호출하며, 응답을 반환합니다.

import { Request, Response } from "express";
import * as userService from "../services/user.services"; // 사용자 서비스 로직 호출

/**
 * 사용자 ID로 사용자 조회 (Prisma 버전)
 */
export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    return;
  }

  // 🔹 diseases 배열을 평탄화해 name만 추출
  const formatted = {
    ...user,
    diseases: user.diseases.map((ud: any) => ud.disease),
    records: user.records.map((r: any) => ({
      ...r,
      symptoms: r.symptoms.map((s: any) => s.symptom),
    })),
  };

  res.json(formatted);

};



/**
 * 사용자 정보 업데이트
 */
export const updateUser = async (req: Request, res: Response) => {
  const updated = await userService.update(req.params.id, req.body);
  res.json(updated);
};

/**
 * 사용자 삭제
 */
export const deleteUser = async (req: Request, res: Response) => {
  const deleted = await userService.remove(req.params.id);
  res.json(deleted);
};