/**
 * symptom.tsx
 * 증상 입력 → 증상 기록 저장 → 예측 요청 → 결과 출력까지의 흐름을 담당하는 화면입니다.
 * 현재는 UI 없이 자동 실행되며, 예측 결과는 result 페이지로 이동하여 확인할 수 있습니다.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { createSymptomRecord } from "@/services/record.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

/**
 * 🔹 SymptomScreen 컴포넌트
 * - 앱에서 증상을 자동으로 기록하고 예측 페이지로 이동하는 역할을 합니다.
 */
export default function SymptomScreen() {
  // ✅ 로그인된 사용자 정보 가져오기 (zustand 기반 상태 관리)
  const { user } = useAuthStore();

  /**
   * 🔹 handleSymptomPrediction
   * - 실제로 증상을 저장하고 예측 페이지로 이동하는 비동기 함수입니다.
   * - 1. 사용자 ID가 없으면 경고 후 중단
   * - 2. POST /records/user/:userId/symptom-records 로 증상 기록 생성
   * - 3. recordId를 AsyncStorage에 저장 (새로고침 시 사용)
   * - 4. result 페이지로 이동하며 recordId를 쿼리스트링으로 전달
   */
  const handleSymptomPrediction = async () => {
    if (!user) {
      console.warn("⚠️ 사용자 정보가 없습니다.");
      return;
    }

    try {
      // ✅ 1단계: 더미 증상 기반으로 증상 기록 생성
      const record = await createSymptomRecord({
        userId: user.id,
        symptomIds: ["symptom-001", "symptom-003"], // 👈 실제 UI 입력으로 대체 예정
      });

      console.log("✅ 증상 기록 생성됨:", record);

      // ✅ 2단계: recordId를 로컬에 저장 → 새로고침 대비
      await AsyncStorage.setItem("latestRecordId", record.id);

      // ✅ 3단계: 결과 페이지로 이동 (recordId 포함)
      router.push(`/result?recordId=${record.id}`);
    } catch (error) {
      console.error("❌ 증상 기록 또는 예측 요청 실패:", error);
    }
  };

  /**
   * 🔹 useEffect
   * - 컴포넌트가 화면에 마운트되자마자 자동으로 handleSymptomPrediction 실행
   */
  useEffect(() => {
    handleSymptomPrediction();
  }, []);

  return null; // 👉 이후에 증상 선택 UI 등으로 대체될 예정
}
