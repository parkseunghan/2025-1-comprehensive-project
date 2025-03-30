"use strict";
// 🔹 record.routes.ts
// 이 파일은 '증상 기록(SymptomRecord)' 관련 API 라우트를 정의합니다.
// 사용자 증상 기록 생성 및 조회에 사용됩니다.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recordController = __importStar(require("../controllers/record.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// [POST] /users/:userId/symptom-records - 증상 기록 생성
router.post("/user/:userId/symptom-records", auth_middleware_1.authMiddleware, recordController.createSymptomRecord);
// [GET] /users/:userId/symptom-records - 특정 사용자 증상 기록 전체 조회
router.get("/user/:userId/symptom-records", auth_middleware_1.authMiddleware, recordController.getSymptomRecordsByUser);
// [GET] /symptom-records/:id - 개별 증상 기록 조회
router.get("/symptom-records/:id", auth_middleware_1.authMiddleware, recordController.getSymptomRecordById);
// [DELETE] /symptom-records/:id - 증상 기록 삭제
router.delete("/symptom-records/:id", auth_middleware_1.authMiddleware, recordController.deleteSymptomRecord);
exports.default = router;
