// 📁 src/services/llm.api.ts
// 사용자가 입력한 자연어 텍스트에서 증상 키워드를 추출하는 API
// 백엔드의 `/llm/extract` 엔드포인트와 연결됩니다.

import axios from './axios';
import { LLMExtractKeyword } from '@/types/symptom.types';



// ✅ 실제 응답: 증상 배열로 리턴
export const extractSymptoms = async (
    text: string
): Promise<LLMExtractKeyword[]> => {
    const res = await axios.post("/llm/extract", { symptomText: text });
    return res.data.keywords;
};