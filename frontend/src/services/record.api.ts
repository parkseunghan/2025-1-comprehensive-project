// 📄 record.api.ts
// 사용자 증상 기록을 생성하는 API 요청 모듈

import axios from "./axios";
import { SubmitSymptomInput, SymptomRecord } from "../types/record";

/**
 * 🔹 증상 기록 생성 요청
 * @route POST /records/user/:userId/symptom-records
 * @param input - 사용자 ID + 증상 ID 배열
 * @returns 생성된 증상 기록 객체
 */
export const createSymptomRecord = async (
    input: SubmitSymptomInput
): Promise<SymptomRecord> => {
    const res = await axios.post(
        `/records/user/${input.userId}/symptom-records`,
        { symptomIds: input.symptomIds }
    );
    return res.data;
};
