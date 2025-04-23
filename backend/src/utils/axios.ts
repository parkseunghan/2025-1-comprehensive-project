// 📄 src/utils/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.AI_API_URL || "http://localhost:8000",
  timeout: 10000,
});

export default instance;
