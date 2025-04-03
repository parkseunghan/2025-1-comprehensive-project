// frontend/app/(record)/result.tsx
// ✅ 이 파일은 사용자의 증상 기록 ID를 기반으로 예측된 질병 결과를 출력하는 화면입니다.
// 현재는 콘솔에 예측 결과를 출력하고, 이후 UI를 구성할 때 화면에 보여주는 형태로 확장합니다.

import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { getPredictionByRecord } from "@/services/prediction.api";

export default function ResultScreen() {
    // URL에서 recordId 추출 (예: /result?recordId=record-001)
    const { recordId } = useLocalSearchParams<{ recordId: string }>();

    /**
     * 🔹 예측 결과 가져오기
     * 1. recordId가 존재할 경우 예측 결과를 API로부터 받아옴
     * 2. 결과는 콘솔에 출력됨 (UI는 추후 구성 예정)
     */
    const fetchPredictionResult = async () => {
        if (!recordId || typeof recordId !== "string") {
            console.warn("⚠️ 유효하지 않은 recordId입니다.");
            return;
        }

        try {
            const prediction = await getPredictionByRecord(recordId);
            console.log("🧠 예측 결과:", prediction.result);
            console.log("✅ 예측 신뢰도:", prediction.confidence);
            console.log("📘 가이드라인:", prediction.guideline);
        } catch (error) {
            console.error("❌ 예측 결과 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchPredictionResult();
    }, [recordId]);

    return null; // 👉 이후에 예측 결과 UI 추가 예정
}
