import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getPredictionByRecord } from "@/services/prediction.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Prediction, PredictionRank } from "@/types/prediction.types";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ResultScreen() {
  const [result, setResult] = useState<Prediction & { ranks: PredictionRank[] } | null>(null);
  const navigation = useNavigation();

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

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "높음":
        return ["#ff416c", "#ff4b2b"];
      case "중간":
        return ["#f7b733", "#fc4a1a"];
      case "낮음":
        return ["#56ab2f", "#a8e063"];
      default:
        return ["#4776E6", "#8E54E9"];
    }
  };

  const getRiskEmoji = (riskLevel) => {
    switch (riskLevel) {
      case "높음":
        return "😰";
      case "중간":
        return "😐";
      case "낮음":
        return "😊";
      default:
        return "🤔";
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (!result) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <MaterialCommunityIcons name="brain" size={60} color="#D92B4B" />
          <Text style={styles.loadingText}>결과를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons name="brain" size={24} color="#D92B4B" />
            <Text style={styles.headerTitle}>예측 결과</Text>
          </View>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>진단 요약</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <MaterialCommunityIcons name="shape" size={20} color="#D92B4B" />
              <Text style={styles.sectionTitle}>분류</Text>
            </View>
            <View style={styles.coarseContainer}>
              <Text style={styles.coarseLabel}>{result.coarseLabel}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#D92B4B" />
              <Text style={styles.sectionTitle}>위험도</Text>
            </View>
            <LinearGradient
              colors={getRiskColor(result.riskLevel)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.riskContainer}
            >
              <View style={styles.riskContent}>
                <Text style={styles.riskScore}>{Number(result.riskScore).toFixed(2)}</Text>
                <View style={styles.riskLevelContainer}>
                  <Text style={styles.riskLevel}>{result.riskLevel}</Text>
                  <Text style={styles.riskEmoji}>{getRiskEmoji(result.riskLevel)}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>예측된 질병 (Top-N)</Text>
          </View>
          <View style={styles.diseaseList}>
            {result.ranks.map((rank, index) => (
              <View key={rank.rank} style={styles.diseaseItem}>
                <View style={styles.rankContainer}>
                  <Text style={styles.rank}>{index + 1}</Text>
                </View>
                <View style={styles.diseaseDetails}>
                  <Text style={styles.diseaseName}>{rank.fineLabel}</Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${rank.riskScore * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.diseaseScore}>{(rank.riskScore * 100).toFixed(1)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>대응 가이드라인</Text>
          </View>
          <View style={styles.guidelineContainer}>
            <View style={styles.guidelineIconContainer}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.guideline}>{result.guideline}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreInfoButton}>
          <Text style={styles.moreInfoButtonText}>상세 정보 보기</Text>
          <Ionicons name="chevron-forward" size={20} color="#D92B4B" />
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="share-variant" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>결과 공유</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.saveButton]}>
            <MaterialCommunityIcons name="content-save" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>PDF로 저장</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
    color: "#555",
  },
  coarseContainer: {
    backgroundColor: "#fdecef",
    padding: 12,
    borderRadius: 12,
  },
  coarseLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#D92B4B",
    textAlign: "center",
  },
  riskContainer: {
    borderRadius: 12,
    padding: 16,
  },
  riskContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  riskScore: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  riskLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  riskLevel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginRight: 8,
  },
  riskEmoji: {
    fontSize: 24,
  },
  diseaseList: {
    marginTop: 8,
  },
  diseaseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D92B4B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rank: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  diseaseDetails: {
    flex: 1,
    flexDirection: "column",
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#D92B4B",
    borderRadius: 3,
  },
  diseaseScore: {
    fontSize: 14,
    color: "#D92B4B",
    fontWeight: "500",
    textAlign: "right",
  },
  guidelineContainer: {
    flexDirection: "row",
    backgroundColor: "#fff9ec",
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  guidelineIconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  guideline: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  moreInfoButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdecef",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  moreInfoButtonText: {
    color: "#D92B4B",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D92B4B",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 6,
  },
  saveButton: {
    backgroundColor: "#9C2D4D",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
});
