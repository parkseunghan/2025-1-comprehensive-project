"use strict";
// 📄 src/routes/prediction.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prediction_controller_1 = require("../controllers/prediction.controller");
const router = (0, express_1.Router)();
// POST /api/prediction → AI 서버에 예측 요청
router.post("/", prediction_controller_1.predictFromAI);
exports.default = router;
