// 📁 src/services/llm.api.ts
// 사용자가 입력한 자연어 텍스트에서 증상 키워드를 추출하는 API
// 백엔드의 `/llm/extract` 엔드포인트와 연결됩니다.

import axios from './axios';

// 서버에 보낼 요청 타입
export interface LLMExtractRequest {
  input: string; // 사용자 입력 텍스트
}

// 서버로부터 받을 응답 타입
export interface LLMExtractResponse {
  symptoms: string[]; // 추출된 증상 키워드 리스트
}

// 증상 추출 요청 함수
export const extractSymptoms = async (
  input: string
): Promise<LLMExtractResponse> => {
  const { data } = await axios.post<LLMExtractResponse>('/llm/extract', {
    input,
  });
  return data;
};
