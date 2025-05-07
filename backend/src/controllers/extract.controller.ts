// 📄 src/controllers/extract.controller.ts
import { Request, Response } from "express";
import { extractSymptomsFromText } from "../services/extract.service";

/**
 * POST /api/symptom-extract
 * 사용자의 입력 문장에서 증상을 추출해 반환합니다.
 */
export const extractSymptomsHandler = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== "string") {
            res.status(400).json({ message: "text는 문자열로 입력되어야 합니다." });
            return;
        }

        const symptoms = await extractSymptomsFromText(text);
        res.status(200).json({ symptoms });
        return;
    } catch (error) {
        console.error("[extractSymptomsHandler] ❌ 증상 추출 실패:", error);
        res.status(500).json({ message: "증상 추출에 실패했습니다." });
        return;
    }
};
