// 📄 screens/(home)/HealthStatsScreen.tsx

import React, { useMemo } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchPredictionStats } from "@/services/prediction.api";
import { Prediction } from "@/types/prediction.types";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: () => "#333",
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
};

export default function HealthStatsScreen() {
  const { data, isLoading } = useQuery<Prediction[]>({
    queryKey: ["predictionStats"],
    queryFn: fetchPredictionStats,
  });

  const {
    avgRisk,
    riskLevelDist,
    coarseDist,
    dailyAvgRisk,
  }: {
    avgRisk: number;
    riskLevelDist: {
      name: string;
      count: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[];
    coarseDist: ChartData;
    dailyAvgRisk: ChartData;
  } = useMemo(() => {
    if (!data) return {
      avgRisk: 0,
      riskLevelDist: [],
      coarseDist: { labels: [], datasets: [{ data: [] }] },
      dailyAvgRisk: { labels: [], datasets: [{ data: [] }] },
    };

    const total = data.length;
    const avgRisk = Number((data.reduce((sum, d) => sum + d.riskScore, 0) / total).toFixed(2));

    const riskLevelMap: Record<string, number> = {};
    const coarseMap: Record<string, number> = {};
    const dailyMap: Record<string, number[]> = {};

    data.forEach(d => {
      riskLevelMap[d.riskLevel] = (riskLevelMap[d.riskLevel] || 0) + 1;
      coarseMap[d.coarseLabel] = (coarseMap[d.coarseLabel] || 0) + 1;

      const date = d.createdAt.split("T")[0];
      if (!dailyMap[date]) dailyMap[date] = [];
      dailyMap[date].push(d.riskScore);
    });

    const riskLevelDist = Object.entries(riskLevelMap).map(([name, count], i) => ({
      name,
      count,
      color: ["#4CAF50", "#FF9800", "#F44336"][i % 3],
      legendFontColor: "#333",
      legendFontSize: 14,
    }));

    const coarseDist: ChartData = {
      labels: Object.keys(coarseMap),
      datasets: [{ data: Object.values(coarseMap) }],
    };

    const dailyAvgRisk: ChartData = {
      labels: Object.keys(dailyMap),
      datasets: [{
        data: Object.values(dailyMap).map(arr =>
          Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
        )
      }]
    };

    return { avgRisk, riskLevelDist, coarseDist, dailyAvgRisk };
  }, [data]);

  if (isLoading || !data) {
    return <Text style={styles.loading}>로딩 중...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>건강 통계 요약</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>⚠ 평균 위험도 점수</Text>
        <Text style={styles.avgScore}>{avgRisk}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🩺 질병 그룹별 진단 수</Text>
        <BarChart
          data={coarseDist}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🔥 위험 레벨 분포</Text>
        <PieChart
          data={riskLevelDist}
          width={screenWidth - 32}
          height={200}
          chartConfig={chartConfig}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📅 날짜별 위험도 평균</Text>
        <LineChart
          data={dailyAvgRisk}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  loading: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  avgScore: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  card: {
    backgroundColor: "#F7F8FA",
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
