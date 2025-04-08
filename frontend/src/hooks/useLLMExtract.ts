// 📁 src/hooks/useLLMExtract.ts
// LLM을 통해 사용자 입력에서 증상을 추출하는 커스텀 훅
// 상태 관리 및 API 요청 로직 포함

import { useState } from 'react';
import { extractSymptoms } from '../services/llm.api';

export const useLLMExtract = () => {
    // 추출된 증상 키워드 리스트
    const [symptoms, setSymptoms] = useState<string[]>([]);

    // 로딩 상태 (API 요청 중)
    const [isLoading, setIsLoading] = useState(false);

    // 오류 발생 여부
    const [hasError, setHasError] = useState(false);

    /**
     * 사용자의 텍스트 입력으로부터 증상을 추출하는 함수
     * @param input 사용자 입력 텍스트 (ex: "기침이 나고 머리가 아파요")
     */
    const handleExtract = async (input: string) => {
        setIsLoading(true);
        setHasError(false);
        try {

            const res = await extractSymptoms(input);
            setSymptoms(res.symptoms); // 추출된 증상 키워드 저장
            // useLLMExtract.ts
            console.log('추출 결과:', res.symptoms);

        } catch (err) {
            console.error('❌ 증상 추출 실패:', err);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        symptoms,
        isLoading,
        hasError,
        handleExtract,
    };
};
