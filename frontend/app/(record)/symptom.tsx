/**
 * symptom.tsx
 * 증상을 입력하면:
 * 1. 사용자 증상 기록 생성
 * 2. 생성된 기록을 기반으로 예측 요청
 * 3. 결과 페이지(result.tsx)로 이동하며 recordId 전달
 *
 * 👉 현재는 UI 없이 더미 증상으로 자동 요청되며,
 * 향후 사용자 입력 기반으로 수정될 예정입니다.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store"; // ✅ 로그인 사용자 정보
import { createSymptomRecord } from "@/services/record.api"; // ✅ 증상 기록 생성 API
import { router } from "expo-router"; // ✅ 화면 전환
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ 로컬 저장소

const STORAGE_KEY = "lastRecordId"; // ✅ 저장 키 상수

export default function SymptomScreen() {
  const { user } = useAuthStore();

  /**
   * handleSymptomPrediction
   * - 로그인 사용자 기반으로 증상 기록을 생성
   * - recordId를 AsyncStorage에 저장
   * - /result 페이지로 이동하면서 recordId 쿼리 전달
   */
  const handleSymptomPrediction = async () => {
    if (!user) {
      console.warn("⚠️ 사용자 정보가 없습니다.");
      return;
    }

    try {
      const record = await createSymptomRecord({
        userId: user.id,
        symptomIds: ["symptom-001", "symptom-003"], // 👉 더미 증상 ID
      });

      // ✅ 로컬에 저장 (새로고침 대비)
      await AsyncStorage.setItem(STORAGE_KEY, record.id);

      // ✅ 결과 페이지로 이동 (쿼리 파라미터 전달)
      router.push(`/result?recordId=${record.id}`);
    } catch (err) {
      console.error("❌ 예측 요청 실패:", err);
    }
  };

  // 🔄 컴포넌트 마운트 시 자동 실행
  useEffect(() => {
    handleSymptomPrediction();
  }, []);

  return null; // 👉 향후 증상 선택 UI로 교체 예정
}
