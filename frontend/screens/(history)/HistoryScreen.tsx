import React from "react";
import {
    View,
    Text,
    FlatList,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchPredictionStats } from "@/services/prediction.api";
import { Prediction } from "@/types/prediction.types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();

    const { data, isLoading } = useQuery<Prediction[]>({
        queryKey: ["predictionHistory"],
        queryFn: fetchPredictionStats,
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case "높음":
                return "#EF4444";
            case "보통":
                return "#F59E0B";
            case "낮음":
                return "#10B981";
            default:
                return "#6B7280";
        }
    };

    const getRiskIcon = (level: string) => {
        switch (level) {
            case "높음":
                return "alert-circle";
            case "보통":
                return "warning";
            case "낮음":
                return "checkmark-circle";
            default:
                return "help-circle";
        }
    };

    const renderItem = ({ item }: { item: Prediction }) => {
        if (!item.id) console.warn("❗ 예측 항목에 ID가 없습니다:", item);
        const date = formatDate(item.createdAt);
        const color = getRiskColor(item.riskLevel);
        const iconName = getRiskIcon(item.riskLevel);

        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                    <Text style={styles.date}>{date}</Text>
                </View>

                <View style={styles.contentRow}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelTitle}>분류</Text>
                        <Text style={styles.labelValue}>
                            {item.coarseLabel} / {item.fineLabel}
                        </Text>
                    </View>

                    <View style={styles.riskContainer}>
                        <Text style={styles.riskTitle}>위험도</Text>
                        <View
                            style={[styles.riskBadge, { backgroundColor: color + "20" }]}
                        >
                            <Ionicons name={iconName} size={16} color={color} />
                            <Text style={[styles.riskValue, { color }]}>{item.riskLevel}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.scoreContainer}>
                    <View style={styles.scoreBar}>
                        <View
                            style={[
                                styles.scoreProgress,
                                {
                                    width: `${Math.min(item.riskScore * 10, 100)}%`,
                                    backgroundColor: color,
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.score}>
                        위험도 점수: {item.riskScore.toFixed(1)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>기록이 없습니다</Text>
            <Text style={styles.emptySubtitle}>
                예측을 실행하면 이곳에 기록이 표시됩니다
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>예측 기록</Text>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={styles.loadingText}>기록을 불러오는 중...</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => {
                        const key = item.id || `prediction-${index}`;
                        console.log("🔑 Key used:", key);
                        return key;
                    }}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={renderEmptyList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        height: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#6B7280",
    },
    list: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        ...Platform.select({
            web: {
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
            },
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    date: {
        fontSize: 14,
        color: "#6B7280",
        marginLeft: 6,
    },
    contentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    labelContainer: {
        flex: 2,
    },
    labelTitle: {
        fontSize: 12,
        color: "#9CA3AF",
        marginBottom: 4,
    },
    labelValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    riskContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    riskTitle: {
        fontSize: 12,
        color: "#9CA3AF",
        marginBottom: 4,
    },
    riskBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
    },
    riskValue: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 4,
    },
    scoreContainer: {
        marginTop: 8,
    },
    scoreBar: {
        height: 8,
        backgroundColor: "#F3F4F6",
        borderRadius: 4,
        marginBottom: 8,
        overflow: "hidden",
    },
    scoreProgress: {
        height: "100%",
        borderRadius: 4,
    },
    score: {
        fontSize: 14,
        color: "#4B5563",
        textAlign: "right",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#374151",
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        paddingHorizontal: 32,
    },
});
