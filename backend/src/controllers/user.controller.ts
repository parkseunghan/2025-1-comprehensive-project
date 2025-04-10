// 🔹 user.controller.ts
// 사용자 API 요청을 처리하는 컨트롤러 계층입니다.
// 요청 데이터를 파싱하고 서비스 로직을 호출하며 응답을 반환합니다.

import { Request, Response } from "express";
import * as userService from "../services/user.services";

/**
 * 사용자 ID로 사용자 조회
 * GET /users/:id
 */
export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    return;
  }

  res.json(user);
};

/**
 * 사용자 정보 업데이트
 * PATCH /users/:id
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await userService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error("❌ 사용자 업데이트 오류:", err);
    res.status(500).json({ message: "사용자 정보를 수정하는 중 오류가 발생했습니다." });
  }
};

/**
 * 사용자 삭제
 * DELETE /users/:id
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await userService.remove(req.params.id);
    res.json(deleted);
  } catch (err) {
    console.error("❌ 사용자 삭제 오류:", err);
    res.status(500).json({ message: "사용자를 삭제하는 중 오류가 발생했습니다." });
  }
};
