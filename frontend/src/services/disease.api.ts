// 📄 services/disease.api.ts

import axios from "./axios";
import { Disease } from "@/types/disease.types"; // 필요하다면 정의

export const fetchAllDiseases = async (): Promise<Disease[]> => {
  const res = await axios.get("/diseases");
  return res.data; // 🔥 요 부분이 핵심!
};
