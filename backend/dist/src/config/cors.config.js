"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = exports.corsOptions = void 0;
// 📄 src/config/cors.config.ts
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// ✅ CORS 허용 옵션 정의
exports.corsOptions = {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:8081",
    credentials: true, // 쿠키/Authorization 헤더 허용
};
// ✅ 미들웨어 내보내기
exports.corsMiddleware = (0, cors_1.default)(exports.corsOptions);
