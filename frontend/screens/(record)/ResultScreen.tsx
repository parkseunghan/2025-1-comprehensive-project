// 📄 screens/(record)/ResultScreen.tsx
// 예측 결과 화면: 백엔드에서 예측 결과를 조회하여 시각적으로 보여줌

import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPredictionByRecord } from "@/services/prediction.api";
import type { PredictionResult } from "@/types/prediction";

export default function ResultScreen() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      const recordId = await AsyncStorage.getItem("lastRecordId");
      if (!recordId) return;

      try {
        const data = await getPredictionByRecord(recordId);
        setResult(data);
      } catch (err) {
        console.error("❌ 예측 결과 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>예측 결과를 불러오는 중입니다...</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.center}>
        <Text>결과가 존재하지 않습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧠 예측 결과</Text>

      <Text style={styles.label}>🔹 분류 (coarse)</Text>
      <Text style={styles.value}>{result.coarseLabel}</Text>

      <Text style={styles.label}>🔹 예측된 질병 (Top-3)</Text>
      {result.top1 && (
        <Text style={styles.item}>1️⃣ {result.top1} ({(result.top1Prob ?? 0) * 100}%)</Text>
      )}
      {result.top2 && (
        <Text style={styles.item}>2️⃣ {result.top2} ({(result.top2Prob ?? 0) * 100}%)</Text>
      )}
      {result.top3 && (
        <Text style={styles.item}>3️⃣ {result.top3} ({(result.top3Prob ?? 0) * 100}%)</Text>
      )}

      <Text style={styles.label}>🔹 위험도</Text>
      <Text style={styles.value}>
        {result.riskScore} / {result.riskLevel}
      </Text>

      <Text style={styles.label}>💡 대응 가이드라인</Text>
      <Text style={styles.value}>{result.guideline}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  item: {
    fontSize: 16,
    marginVertical: 2,
  },
});
