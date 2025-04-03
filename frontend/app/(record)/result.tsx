/**
 * result.tsx
 * 이 파일은 증상 기록을 기반으로 한 예측 결과를 조회하고 화면에 출력하는 역할을 합니다.
 * - symptom.tsx에서 생성한 recordId를 기반으로 예측을 요청하거나 조회합니다.
 * - 새로고침 등으로 recordId가 유실될 경우 AsyncStorage에서 복구합니다.
 */

import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestPrediction,
  getPredictionByRecord,
  PredictionResult,
} from "@/services/prediction.api";

export default function ResultScreen() {
  /**
   * 🔹 useLocalSearchParams
   * - 페이지 URL의 query string 파라미터를 가져오는 훅
   * - /result?recordId=xxx 형태에서 recordId 추출
   */
  const { recordId: paramId } = useLocalSearchParams<{ recordId?: string }>();

  /**
   * 🔹 예측 결과 상태
   * - 서버에서 받은 PredictionResult를 저장
   */
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  /**
   * 🔹 fetchPrediction
   * - 예측 결과를 요청하는 비동기 함수
   * - 1) URL 파라미터로 recordId를 확인
   * - 2) 없으면 AsyncStorage에서 최근 기록된 recordId를 불러옴
   * - 3) POST 요청으로 예측 생성 시도
   * - 4) 이미 예측된 경우 → GET 요청으로 조회
   */
  useEffect(() => {
    const fetchPrediction = async () => {
      let recordId = paramId;

      // ✅ 새로고침 등으로 param이 없을 경우 AsyncStorage에서 복구
      if (!recordId) {
        recordId = await AsyncStorage.getItem("latestRecordId");
        if (!recordId) {
          console.warn("⚠️ recordId가 없습니다.");
          return;
        }
      }

      try {
        // ✅ 예측 생성 요청 (POST)
        const data = await requestPrediction({ recordId });

        // ✅ 성공 시 상태 저장
        setPrediction(data);
      } catch (err: any) {
        // ✅ 이미 예측된 경우 → GET 요청으로 예측 결과 조회
        const message = err?.response?.data?.message;
        if (message === "이미 예측이 생성되었습니다.") {
          try {
            const fallback = await getPredictionByRecord(recordId);
            setPrediction(fallback);
          } catch (e) {
            console.error("❌ 예측 결과 조회 실패:", e);
          }
        } else {
          console.error("❌ 예측 요청 실패:", err);
        }
      }
    };

    fetchPrediction();
  }, [paramId]);

  /**
   * 🔹 화면 렌더링
   * - 예측 결과가 존재할 경우 해당 내용을 출력
   * - 로딩 중일 경우 대기 메시지 출력
   */
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>예측 결과</Text>
      {prediction ? (
        <>
          <Text>
            🧠 질병:{" "}
            {Array.isArray(prediction.result)
              ? prediction.result.join(", ")
              : prediction.result}
          </Text>
          <Text>📋 가이드라인: {prediction.guideline || "없음"}</Text>
          <Text>
            📊 신뢰도:{" "}
            {typeof prediction.confidence === "number"
              ? prediction.confidence.toFixed(2)
              : "없음"}
          </Text>
        </>
      ) : (
        <Text>⏳ 예측 결과를 불러오는 중...</Text>
      )}
    </View>
  );
}
