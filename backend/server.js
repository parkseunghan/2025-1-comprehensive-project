"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./src/routes"));
const cors_1 = __importDefault(require("cors"));
// .env 파일이 root 경로에 있다는 것을 명시적으로 지정
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:8081";
// ✅ CORS 설정 추가
app.use((0, cors_1.default)({
    origin: FRONTEND_ORIGIN,
    credentials: true, // 쿠키/인증 헤더 허용
}));
console.log(`Loaded PORT from .env: ${process.env.BACKEND_PORT}`);
console.log(`Using PORT: ${BACKEND_PORT}`);
console.log("Database URL:", process.env.DATABASE_URL);
console.log("Origin URL:", process.env.FRONTEND_ORIGIN);
console.log("API URL:", process.env.API_URL);
app.use(body_parser_1.default.json());
// 라우터 연결
app.use('/api', routes_1.default);
app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on http://localhost:${BACKEND_PORT} `);
});
