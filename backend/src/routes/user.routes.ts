// 🔹 user.routes.ts
// 이 파일은 사용자(User) 관련 API 엔드포인트를 정의하는 Express 라우터입니다.
// 경로: /api/users

import { Router } from "express";
import * as userController from "../controllers/user.controller"; // 사용자 컨트롤러 로드
import { authMiddleware } from "../middlewares/auth.middleware";
import { createSymptomRecord } from "../controllers/user.controller";

const router = Router();

// [GET] /users/:id - 특정 사용자 정보 조회
router.get("/:id", authMiddleware, userController.getUserById);

// [PATCH] /users/:id - 사용자 정보 수정
router.patch("/:id", authMiddleware, userController.updateUser);

// [DELETE] /users/:id - 사용자 삭제
router.delete("/:id", authMiddleware, userController.deleteUser);

router.post("/:userId/symptom-records", createSymptomRecord);

export default router;
