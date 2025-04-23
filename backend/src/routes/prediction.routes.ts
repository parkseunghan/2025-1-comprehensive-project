// 📄 src/routes/prediction.routes.ts

import { Router, RequestHandler } from "express";
import { predictFromAI } from "../controllers/prediction.controller";

const router = Router();

// POST /api/prediction → AI 서버에 예측 요청
router.post("/", predictFromAI as RequestHandler);

export default router;
