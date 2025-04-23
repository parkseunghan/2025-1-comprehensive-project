// 📄 src/services/prediction.service.ts

import axios from "../utils/axios"; // 공통 axios 인스턴스
import { PredictRequest, PredictResponse } from "@/types/prediction";

export async function requestPrediction(data: PredictRequest): Promise<PredictResponse> {
  const response = await axios.post("/predict", data); // AI 서버로 요청
  return response.data;
}
