// 📄 src/controllers/nlp.controller.ts
import { Request, Response } from "express";
import { extractSymptomsWithNLP } from "../services/nlp.service";

/**
 * POST /api/nlp/extract
 * NLP 기반 증상 추출 엔드포인트
 */
export const extractSymptomsWithNLPHandler = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== "string") {
            res.status(400).json({ message: "text는 문자열이어야 합니다." });
            return;
        }

        const nlpResponse = await extractSymptomsWithNLP(text);
        res.status(200).json(nlpResponse); // ✅ results 포함된 구조 그대로 전달

        return;
    } catch (err) {
        console.error("[extractSymptomsWithNLPHandler] ❌ NLP 추출 실패:", err);
        res.status(500).json({ message: "NLP 추출에 실패했습니다." });
        return;
    }
};
