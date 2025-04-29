"use strict";
// 🔹 user.routes.ts
// 이 파일은 사용자(User) 관련 API 엔드포인트를 정의하는 Express 라우터입니다.
// 경로: /api/users
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
const userController = __importStar(require("../controllers/user.controller")); // 사용자 컨트롤러 로드
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// [GET] /users/:id - 특정 사용자 정보 조회
router.get("/:id", auth_middleware_1.authMiddleware, userController.getUserById);
// [PATCH] /users/:id - 사용자 정보 수정
router.patch("/:id", auth_middleware_1.authMiddleware, userController.updateUser);
// [DELETE] /users/:id - 사용자 삭제
router.delete("/:id", auth_middleware_1.authMiddleware, userController.deleteUser);
router.post("/:userId/symptom-records", user_controller_1.createSymptomRecord);
exports.default = router;
