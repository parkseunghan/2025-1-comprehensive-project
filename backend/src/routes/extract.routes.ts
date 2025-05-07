// 📄 routes/extract.routes.ts
import { Router } from "express";
import { extractSymptomsHandler } from "../controllers/extract.controller";
const router = Router();

// [POST] /api/symptom-extract
router.post("/", extractSymptomsHandler);

export default router;
