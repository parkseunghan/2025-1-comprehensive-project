// 🔹 disease.routes.ts
// 이 파일은 '지병(Disease)' 관련 API 바인딩을 정의합니다.

import { Router } from "express";
import * as diseaseController from "../controllers/disease.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// [GET] /diseases/info-by-name?name=기관지 천식 - 이름으로 질병 정보 조회
router.get("/info-by-name", diseaseController.getDiseaseInfoByName);

// [GET] /diseases - 전체 질병 목록 조회
router.get("/", diseaseController.getAllDiseases);

// [GET] /diseases/:id - 특정 지병 조회
router.get("/:id", diseaseController.getDiseaseById);

// [GET] /diseases/user/:userId - 사용자의 지병 목록
router.get("/user/:userId", authMiddleware, diseaseController.getUserDiseases);

// [POST] /diseases/user/:userId - 사용자에게 지병 추가
router.post("/user/:userId", authMiddleware, diseaseController.addUserDisease);

// [DELETE] /diseases/user/:userId/:diseaseId - 사용자의 지병 삭제
router.delete("/user/:userId/:diseaseId", authMiddleware, diseaseController.deleteUserDisease);

export default router;
