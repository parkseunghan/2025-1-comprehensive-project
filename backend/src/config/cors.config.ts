// 📄 src/config/cors.config.ts
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ✅ CORS 허용 옵션 정의
export const corsOptions = {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:8081",
    // origin: true,
    credentials: true, // 쿠키/Authorization 헤더 허용
};

// ✅ 미들웨어 내보내기
export const corsMiddleware = cors(corsOptions);
