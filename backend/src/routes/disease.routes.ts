// 🔹 disease.routes.ts
// 이 파일은 '지병(Disease)' 관련 API 바이드리기를 정의합니다.
// GET /diseases 이나 /users/:id/diseases 같은 것을 처리합니다.

import { Router } from "express";
import * as diseaseController from "../controllers/disease.controller"; // 지병 컨트롤러 로드

const router = Router();

// [GET] /diseases - 지병 검색/목록
router.get("/", diseaseController.getAllDiseases);

// [GET] /diseases/:id - 특정 지병 조회
router.get("/:id", diseaseController.getDiseaseById);

// [GET] /diseases/users/:userId/ - 사용자의 지병 목록
router.get("/user/:userId", diseaseController.getUserDiseases);

// [POST] /diseases/users/:userId/ - 사용자에게 지병 추가
router.post("/user/:userId", diseaseController.addUserDisease);

// [DELETE] /diseases/users/:userId/:diseaseId - 사용자의 지병 삭제
router.delete("/user/:userId/:diseaseId", diseaseController.deleteUserDisease);

export default router;
