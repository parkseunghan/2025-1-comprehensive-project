// 📄 llm.controller.ts
// 자연어 증상 문장에서 키워드를 추출하는 LLM 추론 API 컨트롤러

import { Request, Response } from "express";
import { extractSymptoms } from "../services/llm.service";

/**
 * POST /llm/extract
 * 사용자의 자연어 문장에서 증상 키워드를 추출하여 반환
 */
export const extractSymptomsHandler = async (req: Request, res: Response) => {
  try {
    const { symptomText } = req.body; // ✅ camelCase로 수정

    if (!symptomText || typeof symptomText !== "string") {
      res.status(400).json({ message: "symptomText는 문자열로 입력되어야 합니다." });
      return;
    }

    const keywords = await extractSymptoms(symptomText); // ✅ 그대로 사용
    res.status(200).json({ keywords });
  } catch (error) {
    console.error("[extractSymptomsHandler] 오류:", error);
    res.status(500).json({ message: "증상 추출에 실패했습니다." });
  }
};



// // 📄 llm.controller.ts
// // 사용자의 입력 문장을 자연스럽게 정제하는 LLM 추론 API 컨트롤러

// import { Request, Response } from "express";
// import { cleanSymptomText } from "../services/llm.service";

// /**
//  * POST /llm/clean
//  * 사용자의 자연어 문장을 자연스럽고 정제된 한글 문장으로 변환
//  */
// export const cleanSymptomTextHandler = async (req: Request, res: Response) => {
//   try {
//     const { symptomText } = req.body;

//     if (!symptomText || typeof symptomText !== "string") {
//       res.status(400).json({ message: "symptomText는 문자열로 입력되어야 합니다." });
//       return;
//     }

//     const cleanedText = await cleanSymptomText(symptomText);
//     res.status(200).json({ cleanedText });
//     return;
//   } catch (error) {
//     console.error("[cleanSymptomTextHandler] ❌ 문장 정제 실패:", error);
//     res.status(500).json({ message: "문장 정제에 실패했습니다." });
//     return;
//   }
// };

