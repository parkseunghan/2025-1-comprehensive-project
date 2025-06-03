import React, { useMemo, useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Platform,
    ScrollView,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
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
    secondary: "#7C84EC",
    accent: "#B39DDB",
    success: "#81C784",
    warning: "#FFB74D",
    danger: "#E57373",
    light: "#FAFAFA",
    dark: "#2C2C2C",
    gray: "#9E9E9E",
    lightGray: "#D3D3D3",
    background: "#F5F5F5",
    cardBackground: "#FFFFFF",
    border: "#E0E0E0",
};

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: () => COLORS.dark,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: COLORS.primary,
        fill: "#fff",
    },
};

export default function HealthStatsScreen() {
    const [activeTab, setActiveTab] = useState("summary");

    // ✅ 애니메이션 초기값 설정
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    // ✅ 애니메이션 실행
    useEffect(() => {
        // 초기화
        fadeAnim.setValue(0);
        translateY.setValue(20);

        // 애니메이션 실행
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [activeTab]); // 🔁 activeTab이 변경될 때마다 실행됨

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
        const avgRisk = Number(
            (data.reduce((sum, d) => sum + d.riskScore, 0) / total).toFixed(1)
        );

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

        const riskLevelDist = Object.entries(riskLevelMap).map(
            ([name, count]) => {
                let color = COLORS.success;
                if (name.includes("높음")) color = COLORS.danger;
                else if (name.includes("중간")) color = COLORS.warning;

                return {
                    name,
                    count,
                    color,
                    legendFontColor: COLORS.dark,
                    legendFontSize: 14,
                };
            }
        );

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
            labels: sortedDates.slice(-7).map((date) => {
                const [, month, day] = date.split("-");
                return `${month}/${day}`;
            }),
            datasets: [
                {
                    data: sortedDates.slice(-7).map((date) => {
                        const values = dailyMap[date];
                        return Number(
                            (
                                values.reduce((a, b) => a + b, 0) /
                                values.length
                            ).toFixed(1)
                        );
                    }),
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    strokeWidth: 2,
                },
            ],
        };

        const entries = Object.entries(coarseMap);
        const highestRiskCategory =
            entries.length > 0
                ? entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                : "";

        return {
            avgRisk,
            riskLevelDist,
            coarseDist,
            dailyAvgRisk,
            highestRiskCategory,
            totalPredictions: total,
        };
    }, [data]);

    const getRiskColor = (score: number) => {
        if (score > 70) return COLORS.danger;
        if (score > 40) return COLORS.warning;
        return COLORS.success;
    };

    const getRiskLabel = (score: number) => {
        if (score > 70) return "높음";
        if (score > 40) return "중간";
        return "낮음";
    };

    const renderRiskIndicator = (score: number) => {
        const color = getRiskColor(score);
        const label = getRiskLabel(score);

        return (
            <View style={styles.riskIndicator}>
                <View style={styles.riskMeterContainer}>
                    <View
                        style={[
                            styles.riskMeter,
                            {
                                width: `${Math.min(score, 100)}%`,
                                backgroundColor: color,
                            },
                        ]}
                    />
                </View>
                <View style={styles.riskLabelContainer}>
                    <Text style={[styles.riskLabel, { color }]}>{label}</Text>
                    <Text style={styles.riskScore}>{score}/100</Text>
                </View>
            </View>
        );
    };

    const renderTabButton = (tabName: string, label: string, icon: string) => {
        const isActive = activeTab === tabName;

        return (
            <TouchableOpacity
                style={[styles.tabButton, isActive && styles.activeTabButton]}
                onPress={() => setActiveTab(tabName)}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={icon as any}
                    size={18}
                    color={isActive ? COLORS.primary : COLORS.gray}
                />
                <Text
                    style={[
                        styles.tabButtonText,
                        isActive && styles.activeTabButtonText,
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    if (isLoading || !data) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loading}>데이터를 불러오는 중...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ✅ 헤더는 애니메이션 제외 */}
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerTitle}>건강 통계</Text>
                <View style={styles.headerSpacer} />
            </View>
            <View style={styles.tabContainer}>
                {renderTabButton("summary", "요약", "home")}
                {renderTabButton("details", "세부", "list")}
                {renderTabButton("trends", "추이", "trending-up")}
            </View>
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{ translateY }],
                    },
                ]}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {activeTab === "summary" && (
                        <>
                            <View style={styles.summaryContainer}>
                                <View style={[styles.card, styles.primaryCard]}>
                                    <View style={styles.cardHeader}>
                                        <Ionicons
                                            name="shield-checkmark"
                                            size={20}
                                            color={COLORS.primary}
                                        />
                                        <Text style={styles.cardTitle}>
                                            평균 위험도
                                        </Text>
                                    </View>
                                    <Text style={styles.primaryValue}>
                                        {avgRisk}
                                    </Text>
                                    {renderRiskIndicator(avgRisk)}
                                </View>

                                <View style={styles.row}>
                                    <View
                                        style={[styles.card, styles.halfCard]}
                                    >
                                        <View style={styles.cardHeader}>
                                            <Ionicons
                                                name="medical"
                                                size={18}
                                                color={COLORS.success}
                                            />
                                            <Text style={styles.cardTitle}>
                                                총 진단
                                            </Text>
                                        </View>
                                        <Text style={styles.secondaryValue}>
                                            {totalPredictions}
                                        </Text>
                                    </View>
                                    <View
                                        style={[styles.card, styles.halfCard]}
                                    >
                                        <View style={styles.cardHeader}>
                                            <Ionicons
                                                name="warning"
                                                size={18}
                                                color={COLORS.warning}
                                            />
                                            <Text style={styles.cardTitle}>
                                                주요 위험
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.secondaryValue,
                                                styles.smallText,
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {highestRiskCategory || "없음"}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Ionicons
                                        name="pie-chart"
                                        size={20}
                                        color={COLORS.secondary}
                                    />
                                    <Text style={styles.cardTitle}>
                                        위험 레벨 분포
                                    </Text>
                                </View>
                                <View style={styles.chartContainer}>
                                    <PieChart
                                        data={riskLevelDist}
                                        width={screenWidth - 64}
                                        height={200}
                                        chartConfig={chartConfig}
                                        accessor="count"
                                        backgroundColor="transparent"
                                        paddingLeft="15"
                                        absolute
                                        hasLegend={true}
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    {activeTab === "details" && (
                        <>
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Ionicons
                                        name="bar-chart"
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.cardTitle}>
                                        질병 그룹별 진단 수
                                    </Text>
                                </View>
                                <View style={styles.chartContainer}>
                                    <BarChart
                                        data={coarseDist}
                                        width={screenWidth - 64}
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
                                    />
                                </View>
                            </View>

                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Ionicons
                                        name="analytics"
                                        size={20}
                                        color={COLORS.accent}
                                    />
                                    <Text style={styles.cardTitle}>
                                        위험 레벨별 건수
                                    </Text>
                                </View>
                                <View style={styles.statsContainer}>
                                    {riskLevelDist.map((item, index) => (
                                        <View
                                            key={index}
                                            style={styles.statItem}
                                        >
                                            <View
                                                style={[
                                                    styles.statBadge,
                                                    {
                                                        backgroundColor:
                                                            item.color,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={styles.statBadgeText}
                                                >
                                                    {item.count}
                                                </Text>
                                            </View>
                                            <Text style={styles.statLabel}>
                                                {item.name}
                                            </Text>
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
                                    <Ionicons
                                        name="trending-up"
                                        size={20}
                                        color={COLORS.secondary}
                                    />
                                    <Text style={styles.cardTitle}>
                                        최근 7일 위험도 추이
                                    </Text>
                                </View>
                                <View style={styles.chartContainer}>
                                    <LineChart
                                        data={dailyAvgRisk}
                                        width={screenWidth - 64}
                                        height={220}
                                        chartConfig={chartConfig}
                                        bezier
                                        withDots={true}
                                        withShadow={false}
                                        withVerticalLines={false}
                                        withHorizontalLines={true}
                                    />
                                </View>
                            </View>

                            <View style={[styles.card, styles.insightCard]}>
                                <View style={styles.cardHeader}>
                                    <Ionicons
                                        name="bulb"
                                        size={20}
                                        color={COLORS.accent}
                                    />
                                    <Text style={styles.cardTitle}>
                                        건강 상태 분석
                                    </Text>
                                </View>
                                <Text style={styles.insightText}>
                                    {avgRisk > 60
                                        ? "🚨 최근 위험도가 높은 패턴을 보이고 있습니다. 정기 검진을 권장합니다."
                                        : avgRisk > 30
                                        ? "⚠️ 중간 수준의 위험도를 유지하고 있습니다. 주기적인 모니터링을 권장합니다."
                                        : "✅ 안정적인 건강 상태를 유지하고 있습니다. 현재 생활 습관을 유지하세요."}
                                </Text>
                                <View
                                    style={[
                                        styles.insightBadge,
                                        {
                                            backgroundColor:
                                                getRiskColor(avgRisk),
                                        },
                                    ]}
                                >
                                    <Text style={styles.insightBadgeText}>
                                        {getRiskLabel(avgRisk)}
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    loading: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray,
        fontWeight: "500",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: COLORS.cardBackground,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
    },
    headerSpacer: {
        width: 40,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: COLORS.dark,
        textAlign: "center",
        flex: 1,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.cardBackground,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
    },
    tabButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        borderRadius: 10,
        backgroundColor: "transparent",
    },
    activeTabButton: {
        backgroundColor: COLORS.light,
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.gray,
        marginLeft: 6,
    },
    activeTabButtonText: {
        color: COLORS.primary,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    summaryContainer: {
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    primaryCard: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    halfCard: {
        flex: 0.48,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
        color: COLORS.dark,
    },
    primaryValue: {
        fontSize: 32,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 12,
    },
    secondaryValue: {
        fontSize: 24,
        fontWeight: "600",
        color: COLORS.dark,
    },
    smallText: {
        fontSize: 16,
        lineHeight: 20,
    },
    riskIndicator: {
        marginTop: 8,
    },
    riskMeterContainer: {
        height: 6,
        backgroundColor: COLORS.light,
        borderRadius: 3,
        overflow: "hidden",
    },
    riskMeter: {
        height: "100%",
        borderRadius: 3,
    },
    riskLabelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    riskLabel: {
        fontSize: 14,
        fontWeight: "600",
    },
    riskScore: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.gray,
    },
    chartContainer: {
        alignItems: "center",
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 8,
    },
    statItem: {
        alignItems: "center",
        flex: 1,
    },
    statBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    statBadgeText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.dark,
        fontWeight: "500",
        textAlign: "center",
    },
    insightCard: {
        backgroundColor: "#fff9ec", // 관리팁 배경색
        borderLeftWidth: 4,
        borderLeftColor: "#f59e0b", // 관리팁 테두리색
    },
    insightText: {
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.dark,
        marginBottom: 12,
    },
    insightBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    insightBadgeText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "600",
    },
});
