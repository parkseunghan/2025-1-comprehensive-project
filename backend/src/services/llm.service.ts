// 📄 llm.service.ts
// 자연어 증상 문장에서 증상 키워드 및 시간 정보를 LLM으로 추출하는 서비스 (번역 + 추출 → 매핑 → 한글)

import axios from "axios";
import { normalizeSymptoms } from "../utils/normalizeSymptoms";
import { getKoreanLabels } from "../utils/getKoreanLabels";

/**
 * 자연어 증상 문장에서 증상 + 시간 정보 추출 (최대 3회 시도 후 중복 제거)
 * @param symptomText 사용자가 입력한 문장 (한글)
 * @returns [{ symptom: string, time: string | null }]
 */
export const extractSymptoms = async (
    symptomText: string
): Promise<{ symptom: string; time: string | null }[]> => {
    const results: { symptom: string; time: string | null }[][] = [];

    const prompt = `You are a medical AI that specializes in extracting symptoms from user input.

Your task is to extract ONLY the medical symptoms explicitly mentioned in the following Korean sentence.
- DO NOT guess symptoms that are not clearly stated.
- DO NOT infer, translate, or explain.
- DO NOT include Korean.
- DO NOT add modifiers like (mild), (severe), etc.
- DO NOT include adjectives like "persistent", "chronic", or "frequent" in the symptom field. Instead, express them using the "time" field as "persistent".
Respond ONLY with a valid JSON array of objects.
Each object must include:
- "symptom": an English medical keyword (e.g., "fever", "cough", "abdominal pain")
- "time": "morning", "afternoon", "evening", "night", "persistent" (if the symptom is **frequent or chronic**), or null

Valid Output:
[
  { "symptom": "fever", "time": "night" },
  { "symptom": "headache", "time": null },
  { "symptom": "cough", "time": "persistent" }
]

Now extract symptoms from this sentence:
"${symptomText}"`;

    for (let i = 0; i < 3; i++) {
        console.log(`[extractSymptoms] 🔁 LLM 요청 시도 ${i + 1}...`);
        try {
            const res = await axios.post("http://localhost:11434/api/generate", {
                model: "phi3",
                stream: false,
                prompt,
            });

            const raw = res.data.response.trim();
            console.log(`[extractSymptoms] ✅ 응답 수신 (시도 ${i + 1}): ${raw}`);

            let parsed: { symptom: string; time: string | null }[] = [];

            try {
                parsed = JSON.parse(raw);
            } catch (e) {
                console.warn(`[extractSymptoms] ⚠️ 응답 파싱 실패 (시도 ${i + 1})`, raw);
                continue;
            }

            results.push(parsed);
        } catch (e) {
            console.error(`[extractSymptoms] ❌ LLM 요청 실패 (시도 ${i + 1})`, e);
        }
    }

    // ✅ 시간 우선순위 기반 중복 제거 처리
    const uniqueMap = new Map<string, { symptom: string; time: string | null }>();

    const timePriority: Record<string, number> = {
        morning: 3,
        afternoon: 3,
        evening: 3,
        night: 3,
        persistent: 2,
        "": 1,
        null: 1,
    };

    results.flat().forEach(({ symptom, time }) => {
        let cleanSymptom = symptom.replace(/\s*\(.*?\)/g, "").trim().toLowerCase();

        // ✅ "persistent cough" 보정: time으로 이동
        let adjustedTime = time;
        if (cleanSymptom.startsWith("persistent ")) {
            cleanSymptom = cleanSymptom.replace("persistent ", "").trim();
            adjustedTime = "persistent";
        }

        const normalized = normalizeSymptoms([cleanSymptom])[0];
        const korean = getKoreanLabels([normalized])[0];
        const key = korean;

        const currentPriority = timePriority[adjustedTime ?? ""] || 0;

        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, { symptom: korean, time: adjustedTime });
        } else {
            const existing = uniqueMap.get(key)!;
            const existingPriority = timePriority[existing.time ?? ""] || 0;

            if (currentPriority > existingPriority) {
                uniqueMap.set(key, { symptom: korean, time: adjustedTime });
            }
        }
    });

    const final = Array.from(uniqueMap.values());
    console.log(`[extractSymptoms] 🧪 최종 정제 결과:`, JSON.stringify(final, null, 2));
    return final;
};


// // 📄 llm.service.ts
// // LLM 기반 문장 정제 (증상 추출 X)

// import axios from "axios";

// /**
//  * LLM을 사용해 사용자 입력 문장을 자연스럽게 정제합니다.
//  * - 띄어쓰기, 맞춤법, 비속어, 이모지, 영어혼용 등을 처리
//  * - 결과는 "정제된 한글 문장" 1개 반환
//  */
// export const cleanSymptomText = async (symptomText: string): Promise<string> => {
//     const prompt = `
//     당신은 사용자의 증상 문장을 자연스럽고 명확한 한국어로 정제하는 AI입니다.
    
//     다음은 사용자가 입력한 문장입니다.  
//     오탈자, 이모지(ㅠㅠ 등), 감정 표현, 반복 표현, 영어 단어 등을 제거하고  
//     입력된 모든 증상 정보를 보존하면서 자연스럽고 명확한 한국어 문장으로 정제해주세요.
    
//     📌 출력 조건:
//     - 반드시 한국어 문장만 출력하세요.
//     - 영어 단어나 번역, 주석, 설명은 절대 포함하지 마세요.
//     - 출력은 정제된 한국어 문장만 한 줄 또는 여러 줄로 구성되며, 그 외 어떤 내용도 포함하지 마세요.
    
//     예시:
//     입력: 기치믈 하고, 베가 너무 아파오ㅠㅠㅠ 밤에 열도 나고 몸쌀기운도 이써오..
//     → 정제: 기침이 나고 배가 너무 아파요. 밤에 열도 나고 몸살 기운도 있어요.
    
//     입력 문장:
//     ${symptomText}
    
//     정제된 문장:
//     `;
    
    





//     try {
//         const res = await axios.post("http://localhost:11434/api/generate", {
//             model: "llama3",
//             stream: false,
//             prompt,
//             options: {
//                 temperature: 0.2
//             }
//         });

//         const cleaned = res.data.response.trim();
//         console.log(`[cleanSymptomText] ✅ 정제된 문장: ${cleaned}`);
//         return cleaned;
//     } catch (e) {
//         console.error(`[cleanSymptomText] ❌ LLM 요청 실패`, e);
//         throw new Error("LLM 문장 정제 실패");
//     }
// };
