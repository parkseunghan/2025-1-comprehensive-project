// 📄 routes/nlp.routes.ts
import { Router } from "express";
import { extractSymptomsWithNLPHandler } from "../controllers/nlp.controller";

const router = Router();

// [POST] /api/nlp/extract
router.post("/extract", extractSymptomsWithNLPHandler);

export default router;
