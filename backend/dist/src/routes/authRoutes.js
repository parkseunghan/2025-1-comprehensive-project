"use strict";
// src/routes/authRoutes.ts
// register(사용자 등록) 엔드포인트 라우팅
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// POST /register 경로를 registerUser 함수로 연결
router.post('/register', authController_1.registerUser);
// 디버깅용
/*
router.post('/register', (req, res, next) => {
    console.log('Received request at /register:', req.body); // 요청 본문 로그 출력
    next(); // 다음 미들웨어로 넘김
}, registerUser);
*/
exports.default = router;
