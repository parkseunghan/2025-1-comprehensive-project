"use strict";
// src/routes/userRoutes.ts
// getUserInfo(사용자 정보 조회) 엔드포인트 라우팅
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// 사용자 정보 조회 API
router.get('/:userId', userController_1.getUserInfo);
exports.default = router;
