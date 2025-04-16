// 📄 llm.controller.ts
// 자연어 증상 문장에서 키워드를 추출하는 단독 테스트용 API

import { Request, Response } from "express";
import { extractSymptoms } from "../services/llm.service";

/**
 * POST /llm/symptoms
 * 사용자의 자연어 증상 문장을 받아 증상 키워드를 추출해 반환
 */
export const extractSymptomsHandler = async (req: Request, res: Response) => {
    try {
        const { symptom_text } = req.body;

        if (!symptom_text || typeof symptom_text !== "string") {
            res.status(400).json({ message: "증상 문장을 입력해주세요." });
            return;
        }

        const keywords = await extractSymptoms(symptom_text);
        res.status(200).json({ keywords });
        return;
    } catch (error) {
        console.error("[extractSymptomsHandler] 오류:", error);
        res.status(500).json({ message: "증상 추출에 실패했습니다." });
        return;
    }
};
