/**
 * record.api.ts
 * 이 파일은 사용자 증상 기록을 서버에 생성하는 API 연동 모듈입니다.
 * 사용자 입력 기반으로 증상을 저장한 후, 추후 예측 API로 연결됩니다.
 */

import axios from "./axios";

/**
 * 🔹 SubmitSymptomInput
 * @param userId - 사용자 ID
 * @param symptoms - 선택한 증상 배열
 */
export type SubmitSymptomInput = {
    userId: string;
    symptomIds: string[];
};

/**
 * 🔹 createSymptomRecord
 * @function
 * @param {SubmitSymptomInput} data - 사용자 ID와 증상 리스트
 * @returns 생성된 증상 기록 객체 (ex: { id, symptoms, createdAt })
 *
 * POST /records/user/:userId/symptom-records
 * 사용자의 증상 기록을 DB에 저장합니다.
 */
export const createSymptomRecord = async ({ userId, symptomIds }: SubmitSymptomInput) => {
    const res = await axios.post(`/records/user/${userId}/symptom-records`, {
        symptomIds,
    });
    return res.data;
};
