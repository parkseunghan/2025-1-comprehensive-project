//🔹 medication.routes.ts

import { Router } from "express";
import { getAllMedications } from "../controllers/medication.controller";

const router = Router();

// [GET] /medications - 지병 검색/목록
router.get("/", getAllMedications);

export default router;
