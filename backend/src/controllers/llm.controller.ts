// 📄 llm.controller.ts
// 사용자 입력 문장에서 증상을 추출하는 컨트롤러

import { Request, Response } from "express";
import { extractSymptomsFromLLM } from "../services/llm.service";

/**
 * POST /llm/extract
 * 사용자 문장 리스트를 받아 증상 키워드만 추출
 */
export const extractSymptoms = async (req: Request, res: Response) => {
  const { texts } = req.body;

  if (!Array.isArray(texts) || texts.length === 0) {
    res.status(400).json({ message: "ko: 문장 배열이 필요합니다." });
    return;
  }

  try {
    const symptoms = await extractSymptomsFromLLM(texts);
    res.status(200).json({ symptoms });
  } catch (error) {
    console.error("❌ko: LLM 호출 오류:", error);
    res.status(500).json({ message: "ko: 증상 추출 실패" });
  }
};
