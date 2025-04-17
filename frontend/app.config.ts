// 📄 frontend/app.config.ts
import * as dotenv from "dotenv";
import path from "path";

// ✅ 루트 경로의 .env 명시적으로 불러오기
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
console.log("🌍 [app.config.ts] Loaded API_URL:", process.env.API_URL);
export default {
  expo: {
    name: "SelfDiagnosisApp",
    slug: "selfdiagnosis-app",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
