// 📄 src/controllers/prediction.controller.ts

import { Request, Response } from "express";
import axios from "axios";
import { config } from "dotenv";
config(); // .env 로드

/**
 * POST /api/prediction
 * AI 서버에 증상 데이터를 보내고 예측 결과를 반환합니다.
 */
export const predictFromAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      symptomKeywords,
      age,
      gender,
      height,
      weight,
      bmi,
      chronicDiseases,
      medications,
    } = req.body;

    // ✅ 디버깅 로그
    console.log("📦 [predictFromAI] 요청 수신:");
    console.log("  - gender:", gender);
    console.log("  - age:", age);
    console.log("  - height:", height);
    console.log("  - weight:", weight);
    console.log("  - bmi:", bmi);
    console.log("  - symptomKeywords:", symptomKeywords);
    console.log("  - chronicDiseases:", chronicDiseases);
    console.log("  - medications:", medications);
    console.log("  - raw req.body:", req.body); // 👈 추가 로그

    if (!symptomKeywords || !Array.isArray(symptomKeywords)) {
      res.status(400).json({ message: "symptomKeywords가 필요합니다." });
      return;
    }

    const aiRes = await axios.post(`${process.env.AI_API_URL}/predict`, {
      symptom_keywords: symptomKeywords,
      age,
      gender,
      height,
      weight,
      bmi,
      chronic_diseases: chronicDiseases,
      medications,
    });

    res.status(200).json(aiRes.data);
  } catch (error: any) {
    console.error("❌ AI 예측 오류:", error.message);
    res.status(500).json({ message: "AI 예측 실패", error: error.message });
  }
};
