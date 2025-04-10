"use strict";
// 🔹 routes/index.ts
// 이 파일은 모든 API 도메인별 라우터를 통합하여 Express 애플리케이션에 연결하는 진입점입니다.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const disease_routes_1 = __importDefault(require("./disease.routes"));
const symptom_routes_1 = __importDefault(require("./symptom.routes"));
const record_routes_1 = __importDefault(require("./record.routes"));
const prediction_routes_1 = __importDefault(require("./prediction.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const llm_routes_1 = __importDefault(require("./llm.routes"));
const medication_routes_1 = __importDefault(require("./medication.routes"));
const router = (0, express_1.Router)();
// 사용자 관련 라우터 연결 (/api/users)
router.use("/users", user_routes_1.default);
// 지병 관련 라우터 연결 (/api/diseases)
router.use("/diseases", disease_routes_1.default);
// 증상 관련 라우터 연결 (/api/symptoms)
router.use("/symptoms", symptom_routes_1.default);
// 증상 기록 관련 라우터 연결 (/api/records)
router.use("/records", record_routes_1.default);
// 예측 관련 라우터 연결 (/api/predictions)
router.use("/predictions", prediction_routes_1.default);
// 인증 관련 라우터 연결 (/api/auth)
router.use("/auth", auth_routes_1.default);
// LLM 기반 증상 추출 관련 라우터 연결 (/api/llm)
router.use("/llm", llm_routes_1.default);
// 약물 관련 라우터 연결 (/api/medications)
router.use("/medications", medication_routes_1.default);
exports.default = router;
