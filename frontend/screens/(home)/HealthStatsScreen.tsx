import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    Platform,
    ScrollView,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchPredictionStats } from "@/services/prediction.api";
import { Prediction } from "@/types/prediction.types";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import BackButton from "@/common/BackButton";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const COLORS = {
    primary: "#D92B4B",
    secondary: "#FF6B7A",
    accent: "#FF8FA3",
    success: "#4CC9F0",
    warning: "#FF9500",
    danger: "#FF2D55",
    light: "#F8F9FA",
    dark: "#212529",
    gray: "#6C757D",
    lightGray: "#E9ECEF",
};

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(217, 43, 75, ${opacity})`,
    labelColor: () => COLORS.dark,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForDots: {
        r: "5",
        strokeWidth: "2",
        stroke: COLORS.primary,
    },
};

export default function HealthStatsScreen() {
    const [activeTab, setActiveTab] = useState("summary");

    const { data, isLoading } = useQuery<Prediction[]>({
        queryKey: ["predictionStats"],
        queryFn: fetchPredictionStats,
    });

    const {
        avgRisk,
        riskLevelDist,
        coarseDist,
        dailyAvgRisk,
        highestRiskCategory,
        totalPredictions,
    } = useMemo(() => {
        if (!data)
            return {
                avgRisk: 0,
                riskLevelDist: [],
                coarseDist: { labels: [], datasets: [{ data: [] }] },
                dailyAvgRisk: { labels: [], datasets: [{ data: [] }] },
                highestRiskCategory: "",
                totalPredictions: 0,
            };

        const total = data.length;
        const avgRisk = Number((data.reduce((sum, d) => sum + d.riskScore, 0) / total).toFixed(2));

        const riskLevelMap: Record<string, number> = {};
        const coarseMap: Record<string, number> = {};
        const dailyMap: Record<string, number[]> = {};

        data.forEach((d) => {
            riskLevelMap[d.riskLevel] = (riskLevelMap[d.riskLevel] || 0) + 1;
            coarseMap[d.coarseLabel] = (coarseMap[d.coarseLabel] || 0) + 1;

            const date = d.createdAt.split("T")[0];
            if (!dailyMap[date]) dailyMap[date] = [];
            dailyMap[date].push(d.riskScore);
        });

        const riskLevelDist = Object.entries(riskLevelMap).map(([name, count], i) => ({
            name,
            count,
            color: [COLORS.success, COLORS.accent, COLORS.primary][i % 3],
            legendFontColor: COLORS.dark,
            legendFontSize: 12,
        }));

        const coarseDist: ChartData = {
            labels: Object.keys(coarseMap).map((label) =>
                label.length > 8 ? label.substring(0, 8) + "..." : label
            ),
            datasets: [
                {
                    data: Object.values(coarseMap),
                    color: (opacity = 1) => COLORS.primary,
                },
            ],
        };

        const sortedDates = Object.keys(dailyMap).sort();
        const dailyAvgRisk: ChartData = {
            labels: sortedDates.map((date) => {
                const [year, month, day] = date.split("-");
                return `${month}/${day}`;
            }),
            datasets: [
                {
                    data: sortedDates.map((date) => {
                        const values = dailyMap[date];
                        return Number(
                            (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
                        );
                    }),
                    color: (opacity = 1) => `rgba(217, 43, 75, ${opacity})`,
                    strokeWidth: 2,
                },
            ],
        };

        const entries = Object.entries(coarseMap);
        const highestRiskCategory =
            entries.length > 0 ? entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0] : "";

        return {
            avgRisk,
            riskLevelDist,
            coarseDist,
            dailyAvgRisk,
            highestRiskCategory,
            totalPredictions: total,
        };
    }, [data]);

    const renderRiskIndicator = (score: number) => {
        let color = COLORS.success;
        let label = "낮음";

        if (score > 70) {
            color = COLORS.primary;
            label = "높음";
        } else if (score > 40) {
            color = COLORS.accent;
            label = "중간";
        }

        return (
            <View style={styles.riskIndicator}>
                <View style={[styles.riskMeter, { width: `${score}%` }]}>
                    <View style={[styles.riskLevel, { backgroundColor: color }]} />
                </View>
                <Text style={[styles.riskLabel, { color }]}>
                    {label} ({score})
                </Text>
            </View>
        );
    };

    const renderTabButton = (tabName: string, label: string, icon: string) => (
        <TouchableOpacity
            style={[styles.tabButton, activeTab === tabName && styles.activeTabButton]}
            onPress={() => setActiveTab(tabName)}
        >
            <Ionicons
                name={icon as any}
                size={18}
                color={activeTab === tabName ? COLORS.primary : COLORS.gray}
            />
            <Text
                style={[styles.tabButtonText, activeTab === tabName && styles.activeTabButtonText]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading || !data) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loading}>데이터를 불러오는 중...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <BackButton />
                <View style={styles.headerSpacer} />
                <Text style={styles.headerTitle}>건강 통계 요약</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.tabContainer}>
                {renderTabButton("summary", "요약", "stats-chart")}
                {renderTabButton("details", "세부 정보", "list")}
                {renderTabButton("trends", "추이", "trending-up")}
            </View>

            {activeTab === "summary" && (
                <>
                    <View style={styles.summaryContainer}>
                        <View style={[styles.summaryCard, styles.primaryCard]}>
                            <Text style={styles.summaryCardTitle}>평균 위험도</Text>
                            <Text style={styles.summaryCardValue}>{avgRisk}</Text>
                            {renderRiskIndicator(avgRisk)}
                        </View>
                        <View style={styles.summaryRow}>
                            <View style={[styles.summaryCard, styles.halfCard]}>
                                <Text style={styles.summaryCardTitle}>총 진단 수</Text>
                                <Text style={styles.summaryCardValue}>{totalPredictions}</Text>
                            </View>
                            <View style={[styles.summaryCard, styles.halfCard]}>
                                <Text style={styles.summaryCardTitle}>주요 위험 영역</Text>
                                <Text style={styles.summaryCardValue} numberOfLines={1}>
                                    {highestRiskCategory}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="warning" size={18} color={COLORS.warning} />
                            <Text style={styles.sectionTitle}>위험 레벨 분포</Text>
                        </View>
                        <PieChart
                            data={riskLevelDist}
                            width={screenWidth - 32}
                            height={200}
                            chartConfig={chartConfig}
                            accessor="count"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                            hasLegend={true}
                        />
                    </View>
                </>
            )}

            {activeTab === "details" && (
                <>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="medical" size={18} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>질병 그룹별 진단 수</Text>
                        </View>
                        <BarChart
                            data={coarseDist}
                            width={screenWidth - 32}
                            height={220}
                            chartConfig={{
                                ...chartConfig,
                                barPercentage: 0.6,
                                decimalPlaces: 0,
                            }}
                            fromZero
                            yAxisLabel=""
                            yAxisSuffix=""
                            showValuesOnTopOfBars
                            withInnerLines={false}
                            style={styles.chart}
                        />
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="warning" size={18} color={COLORS.warning} />
                            <Text style={styles.sectionTitle}>위험 레벨별 건수</Text>
                        </View>
                        <View style={styles.statsContainer}>
                            {riskLevelDist.map((item, index) => (
                                <View key={index} style={styles.statItem}>
                                    <View
                                        style={[styles.statBadge, { backgroundColor: item.color }]}
                                    >
                                        <Text style={styles.statBadgeText}>{item.count}</Text>
                                    </View>
                                    <Text style={styles.statLabel}>{item.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </>
            )}

            {activeTab === "trends" && (
                <>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="calendar" size={18} color={COLORS.secondary} />
                            <Text style={styles.sectionTitle}>날짜별 위험도 추이</Text>
                        </View>
                        <LineChart
                            data={dailyAvgRisk}
                            width={screenWidth - 32}
                            height={220}
                            chartConfig={{
                                ...chartConfig,
                                propsForBackgroundLines: {
                                    strokeDasharray: "",
                                    stroke: COLORS.lightGray,
                                },
                            }}
                            bezier
                            style={styles.chart}
                            withDots={true}
                            withShadow={false}
                            withVerticalLines={false}
                        />
                    </View>

                    <View style={[styles.card, styles.patternCard]}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="analytics" size={18} color={COLORS.accent} />
                            <Text style={styles.sectionTitle}>위험도 패턴 분석</Text>
                        </View>
                        <Text style={styles.patternText}>
                            {avgRisk > 60
                                ? "최근 위험도가 높은 패턴을 보이고 있습니다. 정기 검진을 권장합니다."
                                : avgRisk > 30
                                    ? "중간 수준의 위험도를 유지하고 있습니다. 주기적인 모니터링을 권장합니다."
                                    : "안정적인 건강 상태를 유지하고 있습니다. 현재 생활 습관을 유지하세요."}
                        </Text>
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        padding: 16,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loading: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    headerSpacer: {
        flex: 1,
    },
    headerTitle: {
        flex: 2,
        fontSize: 20,
        fontWeight: "bold",
        color: "#222",
    },
    tabContainer: {
        flexDirection: "row",
        marginBottom: 16,
        marginTop: 8,
    },
    tabButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: COLORS.light,
        marginHorizontal: 4,
    },
    activeTabButton: {
        backgroundColor: `${COLORS.primary}15`,
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.gray,
        marginLeft: 6,
    },
    activeTabButtonText: {
        color: COLORS.primary,
    },
    summaryContainer: {
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    summaryCard: {
        backgroundColor: "#F7F8FA",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    primaryCard: {
        backgroundColor: "#FFF0F3",
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    halfCard: {
        flex: 0.48,
    },
    summaryCardTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.gray,
        marginBottom: 6,
    },
    summaryCardValue: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
    },
    riskIndicator: {
        marginTop: 10,
    },
    riskMeter: {
        height: 6,
        backgroundColor: "#EAEAEA",
        borderRadius: 3,
        overflow: "hidden",
    },
    riskLevel: {
        height: "100%",
        borderRadius: 3,
    },
    riskLabel: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600",
        textAlign: "right",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
        color: COLORS.dark,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 8,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap",
    },
    statItem: {
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    statBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    statBadgeText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.dark,
        fontWeight: "500",
    },
    patternCard: {
        backgroundColor: "#FFF9FA",
    },
    patternText: {
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.dark,
    },
});
