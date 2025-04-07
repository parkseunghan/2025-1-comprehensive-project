/**
 * result.tsx
 * symptom.tsx에서 전달된 recordId를 기반으로:
 * 1. 예측 요청 → 성공 시 결과 표시
 * 2. 이미 예측된 경우 → GET 요청으로 대체
 * 3. 새로고침 시에도 recordId를 AsyncStorage에서 복원
 */

import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    requestPrediction,
    getPredictionByRecord,
} from "@/services/prediction.api";

const STORAGE_KEY = "lastRecordId"; // ✅ 저장된 기록 ID를 불러올 키

export default function ResultScreen() {
    const { recordId: recordIdParam } = useLocalSearchParams<{ recordId?: string }>();

    // 🔹 예측 결과 상태 관리
    const [recordId, setRecordId] = useState<string | null>(null);
    const [result, setResult] = useState<string[] | null>(null);
    const [guideline, setGuideline] = useState<string>();
    const [confidence, setConfidence] = useState<number>();

    /**
     * loadRecordId
     * - URL 파라미터가 있으면 우선 사용하고 저장
     * - 없으면 AsyncStorage에서 마지막 recordId 복원
     */
    const loadRecordId = async () => {
        if (recordIdParam) {
            await AsyncStorage.setItem(STORAGE_KEY, recordIdParam);
            setRecordId(recordIdParam);
        } else {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) setRecordId(saved);
        }
    };

    /**
     * fetchPrediction
     * @param id - 증상 기록 ID
     *
     * - 예측 요청 (POST)
     * - 실패 시 이미 예측된 경우 → GET으로 대체
     */
    const fetchPrediction = async (id: string) => {
        try {
            const res = await requestPrediction({ recordId: id });

            if ("result" in res) {
                // ✅ 예측 성공
                setResult(res.result);
                setGuideline(res.guideline);
                setConfidence(res.confidence);

            } else {
                // ✅ 이미 예측된 경우
                const fallback = await getPredictionByRecord(id);
                setResult(fallback.result);
                setGuideline(fallback.guideline);
                setConfidence(fallback.confidence);
            }
        } catch (err) {
            console.error("❌ 예측 결과 요청 실패:", err);
        }
    };

    // 🔄 최초 실행: recordId 복원
    useEffect(() => {
        loadRecordId();
    }, []);

    // 🔄 recordId 변경 시 예측 요청
    useEffect(() => {
        if (recordId) {
            fetchPrediction(recordId);
        }
    }, [recordId]);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>예측 결과</Text>
            {result ? (
                <>
                    <Text>
                        🧠 질병: {Array.isArray(result) ? result.join(", ") : result || "결과 없음"}
                    </Text>
                    <Text>📋 가이드라인: {guideline || "없음"}</Text>
                    <Text>📊 신뢰도: {confidence?.toFixed(2)}</Text>
                </>
            ) : (
                <Text>⏳ 예측 결과를 불러오는 중...</Text>
            )}

        </View>
    );
}
