"use strict";
// 🔹 disease.routes.ts
// 이 파일은 '지병(Disease)' 관련 API 바이드리기를 정의합니다.
// GET /diseases 이나 /users/:id/diseases 같은 것을 처리합니다.
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
const diseaseController = __importStar(require("../controllers/disease.controller")); // 지병 컨트롤러 로드
const router = (0, express_1.Router)();
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
exports.default = router;
