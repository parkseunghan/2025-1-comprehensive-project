import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchPredictionStats } from "@/services/prediction.api";
import { Prediction } from "@/types/prediction.types";
import { router } from "expo-router";

export default function HistoryScreen() {
  const { data, isLoading } = useQuery<Prediction[]>({
    queryKey: ["predictionHistory"],
    queryFn: fetchPredictionStats, // 동일한 API 재사용
  });

  const renderItem = ({ item }: { item: Prediction }) => {
    const date = new Date(item.createdAt).toLocaleDateString("ko-KR");
    const color = getRiskColor(item.riskLevel);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // TODO: 상세 페이지 연결 예정
          // router.push(`/history/${item.id}`);
        }}
      >
        <View style={styles.row}>
          <Text style={styles.date}>{date}</Text>
          <Text style={[styles.riskLevel, { color }]}>{item.riskLevel}</Text>
        </View>
        <Text style={styles.label}>{item.coarseLabel} / {item.fineLabel}</Text>
        <Text style={styles.score}>위험도 점수: {item.riskScore.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "높음": return "#EF4444";
      case "중간": return "#F59E0B";
      case "낮음": return "#10B981";
      default: return "#6B7280";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>예측 기록</Text>
      {isLoading ? (
        <Text style={styles.loading}>불러오는 중...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  loading: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  score: {
    fontSize: 14,
    color: "#4B5563",
  },
});
