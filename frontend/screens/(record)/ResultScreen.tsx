// 📄 screens/(record)/ResultScreen.tsx

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Animated,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { getPredictionByRecord } from "@/services/prediction.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Prediction, PredictionRank } from "@/types/prediction.types";
import { LinearGradient } from "expo-linear-gradient";
import {
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome5,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { diseaseNameMap } from "@/utils/diseaseMapping";
import { getDiseaseInfo } from "@/services/disease.api";
import RiskGuidelineButton from "@/common/RiskGuidelineButton";

const { width } = Dimensions.get("window");

export default function ResultScreen() {
    const [result, setResult] = useState<
        (Prediction & { ranks: PredictionRank[] }) | null
    >(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [diseaseInfo, setDiseaseInfo] = useState<{
        description: string;
        tips: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setIsLoading(true);
                const recordId = await AsyncStorage.getItem("lastRecordId");
                if (!recordId) return;
                const result = await getPredictionByRecord(recordId);
                setResult(result);

                if (result?.ranks && result.ranks.length > 0) {
                    const topDisease = result.ranks[0];
                    const mappedName = diseaseNameMap[topDisease.fineLabel];
                    if (mappedName) {
                        const info = await getDiseaseInfo(mappedName);
                        if (info) {
                            setDiseaseInfo({
                                description: info.description,
                                tips: info.tips,
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("결과 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };
        fetchResult();
    }, []);

    useEffect(() => {
        if (!result?.ranks || result.ranks.length === 0) return;
        const selected = result.ranks[selectedIndex];
        const mappedName = diseaseNameMap[selected.fineLabel];
        if (mappedName) {
            getDiseaseInfo(mappedName).then((info) => {
                if (info) {
                    setDiseaseInfo({
                        description: info.description,
                        tips: info.tips,
                    });
                }
            });
        }
    }, [result, selectedIndex]);

    const getRiskColor = (riskLevel: string): [string, string] => {
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

    const getRiskEmoji = (riskLevel: string) => {
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

    const handleExit = () => {
        router.replace("/");
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <LinearGradient
                        colors={["#D92B4B", "#9C2D4D"]}
                        style={styles.loadingIconContainer}
                    >
                        <MaterialCommunityIcons
                            name="brain"
                            size={40}
                            color="#fff"
                        />
                    </LinearGradient>
                    <ActivityIndicator
                        size="large"
                        color="#D92B4B"
                        style={{ marginTop: 20 }}
                    />
                    <Text style={styles.loadingText}>
                        AI가 분석 결과를 준비하고 있습니다
                    </Text>
                    <Text style={styles.loadingSubText}>
                        잠시만 기다려주세요...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!result) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <View style={styles.errorContent}>
                    <MaterialCommunityIcons
                        name="alert-circle-outline"
                        size={60}
                        color="#D92B4B"
                    />
                    <Text style={styles.errorText}>
                        결과를 불러올 수 없습니다
                    </Text>
                    <TouchableOpacity
                        onPress={handleExit}
                        style={styles.errorButton}
                    >
                        <Text style={styles.errorButtonText}>
                            처음으로 돌아가기
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const topDisease = result.ranks[0];
    const mappedTopDiseaseName =
        diseaseNameMap[topDisease.fineLabel] || topDisease.fineLabel;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>진단 예측 결과</Text>
            </View>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.animatedContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* 최우선 예측 질병 카드 */}
                    <View style={styles.topResultCard}>
                        <LinearGradient
                            colors={getRiskColor(result.riskLevel)}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.topResultGradient}
                        >
                            <View style={styles.topResultHeader}>
                                <View style={styles.diagnosisContainer}>
                                    <Text style={styles.diagnosisLabel}>
                                        최우선 예측 질병
                                    </Text>
                                    <View style={styles.diagnosisBadge}>
                                        <FontAwesome5
                                            name="medal"
                                            size={14}
                                            color="#fff"
                                        />
                                        <Text style={styles.diagnosisBadgeText}>
                                            TOP 1
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.diseaseName}>
                                    {result.coarseLabel} /{" "}
                                    {mappedTopDiseaseName}
                                </Text>
                            </View>

                            <View style={styles.riskIndicatorContainer}>
                                <View style={styles.riskIndicator}>
                                    <View>
                                        <Text style={styles.riskScoreLabel}>
                                            예측확률
                                        </Text>
                                        <Text style={styles.riskScoreText}>
                                            {(
                                                topDisease.riskScore * 100
                                            ).toFixed(1)}
                                            %
                                        </Text>
                                    </View>

                                    {/* ✅ 위험도 + 버튼 가로 배치 */}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginTop: 4,
                                        }}
                                    >
                                        <Text style={styles.riskLevelText}>
                                            {result.riskLevel}{" "}
                                            <Text style={styles.riskEmoji}>
                                                {getRiskEmoji(result.riskLevel)}
                                            </Text>
                                        </Text>
                                        <View style={{ marginLeft: 6 }}>
                                            <RiskGuidelineButton
                                                riskLevel={
                                                    result.riskLevel as any
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.circleContainer}>
                                    <View
                                        style={[
                                            styles.circle,
                                            styles.innerCircle,
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.progressCircle,
                                            {
                                                height: `${
                                                    topDisease.riskScore * 100
                                                }%`,
                                                backgroundColor:
                                                    result.riskLevel === "높음"
                                                        ? "#ff4b2b"
                                                        : result.riskLevel ===
                                                          "중간"
                                                        ? "#fc4a1a"
                                                        : "#56ab2f",
                                            },
                                        ]}
                                    />
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* 질병 정보 카드 */}
                    {diseaseInfo?.description && (
                        <View style={styles.infoCard}>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons
                                    name="information-outline"
                                    size={22}
                                    color="#3b82f6"
                                />
                                <Text style={styles.cardTitle}>질병 정보</Text>
                            </View>
                            <Text style={styles.infoText}>
                                {diseaseInfo.description}
                            </Text>
                        </View>
                    )}

                    {/* 관리 팁 카드 */}
                    <View style={styles.tipsCard}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons
                                name="lightbulb-outline"
                                size={22}
                                color="#f59e0b"
                            />
                            <Text style={styles.cardTitle}>관리 팁</Text>
                        </View>
                        <Text style={styles.tipsText}>
                            {diseaseInfo?.tips ?? result.guideline}
                        </Text>
                    </View>

                    {/* 예측된 다른 질병들 */}
                    <View style={styles.otherDiseasesCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="list" size={22} color="#D92B4B" />
                            <Text style={styles.cardTitle}>
                                다른 가능한 질병
                            </Text>
                        </View>
                        <View style={styles.diseaseList}>
                            {result.ranks.map((rank, index) => (
                                <TouchableOpacity
                                    key={rank.rank}
                                    style={[
                                        styles.diseaseItem,
                                        selectedIndex === index &&
                                            styles.selectedDiseaseItem,
                                    ]}
                                    onPress={() => setSelectedIndex(index)}
                                >
                                    <View style={styles.rankContainer}>
                                        <Text style={styles.rank}>
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <View style={styles.diseaseDetails}>
                                        <Text style={styles.diseaseItemName}>
                                            {result.coarseLabel} /{" "}
                                            {diseaseNameMap[rank.fineLabel] ||
                                                rank.fineLabel}
                                        </Text>
                                        <View
                                            style={styles.progressBarContainer}
                                        >
                                            <View
                                                style={[
                                                    styles.progressBar,
                                                    {
                                                        width: `${
                                                            rank.riskScore * 100
                                                        }%`,
                                                    },
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.diseaseScore}>
                                            확률:{" "}
                                            {(rank.riskScore * 100).toFixed(1)}%
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <Text style={styles.disclaimerText}>
                        본 예측 결과는 참고용이며, 정확한 진단 및 치료는 반드시
                        의사와 상담하시기 바랍니다.
                    </Text>

                    {/* 푸터 버튼 */}
                    <View style={styles.footerButtons}>
                        <TouchableOpacity
                            onPress={() => router.push("/history")}
                            style={[styles.footerButton, styles.historyButton]}
                        >
                            <Ionicons
                                name="time-outline"
                                size={20}
                                color="#D92B4B"
                            />
                            <Text style={styles.historyButtonText}>
                                진단 기록
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleExit}
                            style={[styles.footerButton, styles.exitButton]}
                        >
                            <Text style={styles.exitButtonText}>메인으로</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f7f8fa",
    },
    header: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        backgroundColor: "#f7f8fa",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
    },
    container: {
        flex: 1,
    },
    animatedContainer: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f8fa",
    },
    loadingContent: {
        alignItems: "center",
        padding: 20,
    },
    loadingIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    loadingSubText: {
        marginTop: 8,
        fontSize: 14,
        color: "#888",
    },
    errorContent: {
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 20,
    },
    errorButton: {
        backgroundColor: "#D92B4B",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    errorButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    topResultCard: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    topResultGradient: {
        borderRadius: 16,
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
        color: "rgba(255, 255, 255, 0.8)",
    },
    diagnosisBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    diagnosisBadgeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
        marginLeft: 4,
    },
    diseaseName: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 4,
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
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
    },
    riskScoreText: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
    },
    riskScoreLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    riskLevelText: {
        fontSize: 20,
        fontWeight: "700",
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
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    infoCard: {
        backgroundColor: "#f0f7ff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#3b82f6",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginLeft: 8,
    },
    infoText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#444",
    },
    tipsCard: {
        backgroundColor: "#fff9ec",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#f59e0b",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tipsText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#444",
    },
    otherDiseasesCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    diseaseList: {
        marginTop: 8,
    },
    diseaseItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        borderRadius: 8,
    },
    selectedDiseaseItem: {
        backgroundColor: "#fff0f3",
    },
    rankContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#9C2D4D",
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
    diseaseItemName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: "#f0f0f0",
        borderRadius: 3,
        marginTop: 4,
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
    footerButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 10,
    },
    footerButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    historyButton: {
        backgroundColor: "#fff",
        marginRight: 8,
        flexDirection: "row",
    },
    historyButtonText: {
        color: "#D92B4B",
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 6,
    },
    exitButton: {
        backgroundColor: "#D92B4B",
        marginLeft: 8,
    },
    exitButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    disclaimerText: {
        fontSize: 13,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
        marginHorizontal: 20,
        lineHeight: 18,
    },
});
