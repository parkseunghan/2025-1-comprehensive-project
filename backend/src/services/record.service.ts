// 🔹 record.service.ts
// 이 파일은 증상 기록(SymptomRecord) 관련 비즈니스 로직을 처리하는 서비스 계층입니다.
// 더미 데이터 기반으로 기록 생성, 조회, 삭제 기능을 제공합니다.

import { symptomRecords } from "../mock/symptomRecords";
import { symptomOnRecords } from "../mock/symptomOnRecords";

/**
 * 증상 기록 생성
 * @param userId 사용자 ID
 * @param symptomIds 증상 ID 배열
 */
export const create = (userId: string, symptomIds: string[]) => {
  const recordId = `rec-${Date.now()}`;
  const newRecord = {
    id: recordId,
    userId,
    createdAt: new Date().toISOString(),
  };
  symptomRecords.push(newRecord); // 기록 추가

  // 증상 연결 추가
  symptomIds.forEach((symptomId) => {
    symptomOnRecords.push({
      id: `sor-${Date.now()}-${Math.random()}`,
      recordId,
      symptomId,
    });
  });

  return newRecord;
};

/**
 * 사용자 ID로 해당 사용자의 증상 기록 전체 조회
 */
export const findByUserId = (userId: string) => {
  return symptomRecords.filter((rec) => rec.userId === userId);
};

/**
 * 특정 증상 기록 ID로 조회
 */
export const findById = (id: string) => {
  return symptomRecords.find((rec) => rec.id === id);
};

/**
 * 특정 증상 기록 삭제
 */
export const remove = (id: string) => {
  const index = symptomRecords.findIndex((rec) => rec.id === id);
  if (index !== -1) {
    const deleted = symptomRecords.splice(index, 1)[0];

    // 관련된 symptomOnRecords도 함께 삭제
    for (let i = symptomOnRecords.length - 1; i >= 0; i--) {
      if (symptomOnRecords[i].recordId === id) {
        symptomOnRecords.splice(i, 1);
      }
    }

    return deleted;
  }
  return { message: "Not found" };
};
