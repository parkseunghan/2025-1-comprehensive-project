// 🔹 user.controller.ts
// 이 파일은 사용자 API 요청을 처리하는 컨트롤러 계층입니다.
// 요청 데이터를 파싱하고, 서비스 로직을 호출하며, 응답을 반환합니다.

import { Request, Response } from "express";
import * as userService from "../services/user.service"; // 사용자 서비스 로직 호출

/**
 * 사용자 ID로 사용자 조회
 */
export const getUserById = (req: Request, res: Response) => {
  const user = userService.findById(req.params.id); // 서비스 계층에서 유저 검색
  res.json(user); // 결과 반환
};

/**
 * 사용자 정보 업데이트
 */
export const updateUser = (req: Request, res: Response) => {
  const updated = userService.update(req.params.id, req.body); // ID와 업데이트 데이터 전달
  res.json(updated); // 변경된 사용자 정보 반환
};

/**
 * 사용자 삭제
 */
export const deleteUser = (req: Request, res: Response) => {
  const deleted = userService.remove(req.params.id); // 유저 삭제 요청
  res.json(deleted); // 삭제된 유저 정보 반환
};
