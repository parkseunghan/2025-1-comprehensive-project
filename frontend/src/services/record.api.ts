// 📄 record.api.ts
// 사용자 증상 기록을 생성하는 API 요청 모듈

import axios from "./axios";
import { SubmitSymptomInput, SymptomRecord } from "../types/record";

/**
 * 🔹 증상 기록 생성 요청
 * @route POST /api/records/user/:userId/symptom-records
 * @param input - 사용자 ID + 증상 ID 배열
 * @returns 생성된 증상 기록 객체
 */
export const createSymptomRecord = async (
    input: { userId: string; symptoms: string[] }
): Promise<SymptomRecord> => {
    const { userId, symptoms } = input;
    const res = await axios.post(`/users/${userId}/symptom-records`, { symptomIds: symptoms });
    return res.data;
};
