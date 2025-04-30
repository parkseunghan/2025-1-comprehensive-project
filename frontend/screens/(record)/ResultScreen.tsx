// 📄 screens/(record)/ResultScreen.tsx

import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getPredictionByRecord } from "@/services/prediction.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Prediction, PredictionRank } from "@/types/prediction.types";
import { calculateRiskLevel, generateGuideline } from "@/utils/risk-utils";
import BackButton from "@/common/BackButton";

export default function ResultScreen() {
  const [result, setResult] = useState<Prediction & { ranks: PredictionRank[] } | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      const recordId = await AsyncStorage.getItem("lastRecordId");
      if (!recordId) return;

      const data = await getPredictionByRecord(recordId);
      console.log("[ResultScreen] 예측 결과:", data);
      setResult(data);
    };

    fetchResult();
  }, []);

  if (!result) {
    return (
      <View style={styles.center}>
        <Text>결과가 존재하지 않습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 뒤로가기 버튼 */}
      <BackButton />
      <Text style={styles.title}>🧠 예측 결과</Text>

      {/* coarse 분류 */}
      <Text style={styles.sectionTitle}>🔹 분류 (coarse)</Text>
      <Text style={styles.coarse}>{result.coarseLabel}</Text>

      {/* Top-N Fine 질병 */}
      <Text style={styles.sectionTitle}>🔹 예측된 질병 (Top-N)</Text>
      <View style={styles.topList}>
        {result.ranks.map((rank, index) => (
          <Text key={rank.rank} style={styles.topItem}>
            {index + 1}. {rank.fineLabel} ({(rank.riskScore * 100).toFixed(1)}%)
          </Text>
        ))}
      </View>

      {/* 위험도 */}
      <Text style={styles.sectionTitle}>🔹 위험도</Text>
      <Text style={styles.risk}>
        {result.riskScore.toFixed(2)} / {calculateRiskLevel(result.riskScore)}
      </Text>

      {/* 대응 가이드라인 */}
      <Text style={styles.sectionTitle}>💡 대응 가이드라인</Text>
      <Text style={styles.guideline}>{generateGuideline(calculateRiskLevel(result.riskScore))}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 4,
  },
  coarse: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  topList: {
    marginBottom: 12,
  },
  topItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  risk: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  guideline: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f59e0b",
    marginTop: 4,
  },
});
