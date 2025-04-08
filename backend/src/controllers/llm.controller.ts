// 📄 llm.controller.ts
// 사용자 입력 문장에서 증상을 추출하는 컨트롤러

import { Request, Response } from "express";
import { extractSymptomsFromLLM } from "../services/llm.service";
import { normalizeSymptoms } from "../utils/normalizeSymptoms";
import { getKoreanLabels } from "../utils/getKoreanLabels";

/**
 * POST /llm/extract
 * 사용자 문장 리스트를 받아 LLM으로부터 증상 키워드를 추출하고 정제하여 반환
 */
export const extractSymptoms = async (req: Request, res: Response) => {
    const { texts } = req.body;

    // 유효성 검사: 배열인지, 문장이 있는지 확인
    if (!Array.isArray(texts) || texts.length === 0) {
        res.status(400).json({ message: "ko: 문장 배열이 필요합니다." });
        return;
    }

    try {
        // 1. LLM으로부터 증상 키워드 추출
        const rawSymptoms = await extractSymptomsFromLLM(texts);

        // 2. 표준 증상 키워드로 정제
        const symptoms = normalizeSymptoms(rawSymptoms);

        const korean = getKoreanLabels(symptoms);
        // 3. 최종 응답
        res.status(200).json({ korean });
        // 예: llm.controller.ts
        console.log('LLM 입력 수신:', req.body.input);

    } catch (error) {
        console.error("LLM 호출 오류:", error);
        res.status(500).json({ message: "증상 추출 실패" });
    }
};
