//🔹 medication.routes.ts

import { Router } from "express";
import { getAllMedications } from "../controllers/medication.controller";
import { getMedicationDetail } from "../controllers/medication.controller";

const router = Router();

// [GET] /medications - 지병 검색/목록
router.get("/", getAllMedications);
router.get("/detail/:itemSeq", getMedicationDetail); // 의약품 상세 조회

export default router;
