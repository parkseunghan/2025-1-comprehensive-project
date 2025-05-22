// 📄 screens/(history)/HistoryDetailScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { getRiskColor, getRiskEmoji } from "@/utils/risk-utils";
import { getDiseaseInfo } from "@/services/disease.api";
import { diseaseNameMap } from "@/utils/diseaseMapping";
import { LinearGradient } from "expo-linear-gradient";

export default function HistoryDetailScreen() {
  const {
    date,
    coarseLabel,
    fineLabel,
    riskLevel,
    riskScore,
  } = useLocalSearchParams<{
    date: string;
    coarseLabel: string;
    fineLabel: string;
    riskLevel: string;
    riskScore: string;
  }>();

  const [diseaseInfo, setDiseaseInfo] = useState<{ description?: string; tips?: string } | null>(null);


  const score = Number(riskScore);
  const gradientColors = getRiskColor(riskLevel);
  const emoji = getRiskEmoji(riskLevel);
  const mappedName = diseaseNameMap[fineLabel] || fineLabel;

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await getDiseaseInfo(mappedName);
        if (info) {
          setDiseaseInfo(info);
        }
      } catch (error) {
        console.error("❗ 질병 정보 로딩 실패:", error);
      }
    };
    fetchInfo();
  }, [mappedName]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[gradientColors[0], gradientColors[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topResultCard}
        >
          <View style={styles.topResultHeader}>
            <View style={styles.diagnosisContainer}>
              <View style={styles.diagnosisBadge}>
                <FontAwesome5 name="medal" size={14} color="#fff" />
                <Text style={styles.diagnosisBadgeText}>TOP 1</Text>
              </View>
            </View>
            <Text style={styles.diseaseName}>{mappedName}</Text>
          </View>

          <View style={styles.riskIndicatorContainer}>
            <View style={styles.riskIndicator}>
            <Text style={styles.diagnosisLabel}>위험도</Text>
            <Text style={styles.riskScoreText}>{score.toFixed(1)}점</Text>
              <Text style={styles.riskLevelText}>{riskLevel} {emoji}</Text>
            </View>
          </View>
        </LinearGradient>

        {diseaseInfo?.description && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
              <Text style={styles.cardTitle}>질병 정보</Text>
            </View>
            <Text style={styles.cardText}>{diseaseInfo.description}</Text>
          </View>
        )}

        {diseaseInfo?.tips && (
          <View style={styles.tipCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
              <Text style={styles.cardTitle}>관리 팁</Text>
            </View>
            <Text style={styles.cardText}>{diseaseInfo.tips}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)/history")}
        >
          <Text style={styles.buttonText}>돌아가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f9fafb",
    },
    content: {
      padding: 16,
    },
    topResultCard: {
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 16,
    },
    topResultHeader: {
      padding: 20,
    },
    diagnosisContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    diagnosisLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: "#fff",
    },
    diagnosisBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginBottom: 8,
      },
    diagnosisBadgeText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 12,
      marginLeft: 4,
    },
    diseaseName: {
        fontSize: 28,
        fontWeight: "900",
        color: "#fff",
        marginBottom: 12,
      },      
    riskIndicatorContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    riskIndicator: {
        flexDirection: "column",
        alignItems: "flex-start", 
        gap: 4,
      },
      riskScoreText: {
        fontSize: 26,
        fontWeight: "800",
        color: "#fff",
        marginVertical: 2,
      },
      riskLevelText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
      },
      
    riskEmoji: {
      fontSize: 22,
    },
    circleContainer: {
      width: 80,
      height: 80,
      position: "relative",
      justifyContent: "flex-end",
    },
    circle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      position: "absolute",
    },
    innerCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      position: "absolute",
      top: 5,
      left: 5,
    },
    progressCircle: {
      width: "100%",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    infoCard: {
      backgroundColor: "#EFF6FF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    tipCard: {
      backgroundColor: "#FFF7ED",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginLeft: 6,
    },
    cardText: {
      fontSize: 14,
      color: "#374151",
      lineHeight: 20,
    },
    button: {
      backgroundColor: "#6366F1",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
  