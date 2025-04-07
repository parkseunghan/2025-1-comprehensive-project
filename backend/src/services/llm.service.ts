// 📄 llm.service.ts
// Ollama + mistral 연동을 통해 증상 키워드를 추출하는 서비스 계층

import axios from "axios";
import symptomMap from "../data/symptom-en-ko-map.json"; // 영어 대응 시 매핑 (보류용)

/**
 * 사용자 입력 문장들로 프롬프트 구성
 */
const buildPrompt = (sentences: string[]): string => {
    const joined = sentences.map((s) => `"${s}"`).join(", ");
    return `
You are a medical AI that specializes in extracting symptoms from user input.

- Your task is to extract **ONLY the symptoms explicitly mentioned** in the text.  
- Do NOT guess or infer symptoms not mentioned.  
- Do NOT include explanations, translations, or full sentences.  
- Do NOT include Korean.

- Respond ONLY with a valid JSON array of English symptom keywords.

- Format: ["headache", "cough", "itchy skin"]  
- Invalid: "I have a cough.", "My head hurts.", ["기침", "두통"]

Sentences: ${joined}
`.trim();
};

/**
 * 응답 문자열에서 증상 키워드만 정제 추출
 */
const cleanSymptoms = (raw: string): string[] => {
    try {
      // 여러 줄 중 JSON 배열만 필터링
      const matches = raw.match(/\[.*?\]/g); // 여러 배열 추출
      if (!matches) return [];
  
      const parsed = matches
        .map((m) => JSON.parse(m) as string[])
        .flat()
        .map((s) => s.toLowerCase().trim())
        .filter((s) => /^[a-z\s]+$/.test(s) && s.length < 40); // 영어 증상만 필터링
  
      return [...new Set(parsed)]; // 중복 제거
    } catch (e) {
      console.warn("증상 파싱 실패:", raw);
      return [];
    }
  };
  

/**
 * mistral 모델에 증상 추출 요청
 */
export const extractSymptomsFromLLM = async (sentences: string[]): Promise<string[]> => {
    const prompt = buildPrompt(sentences);
    const maxRetries = 3;

    for (let i = 0; i < maxRetries; i++) {
        const res = await axios.post("http://localhost:11434/api/generate", {
            model: "mistral",
            prompt,
            stream: false,
        });

        const raw = res.data.response.trim();
        console.log(`[${i + 1}] LLM 응답:`, raw);

        const symptoms = cleanSymptoms(raw);
        if (symptoms.length > 0) return symptoms;
    }

    return [];
};
