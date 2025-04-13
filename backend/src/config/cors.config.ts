// 📄 src/config/cors.config.ts
import cors from "cors";

// ✅ CORS 허용 옵션 정의
export const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:8081",
  credentials: true, // 쿠키/Authorization 헤더 허용
};

// ✅ 미들웨어 내보내기
export const corsMiddleware = cors(corsOptions);
