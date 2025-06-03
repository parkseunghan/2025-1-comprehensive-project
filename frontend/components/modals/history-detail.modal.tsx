// 📄 modals/history-detail.modal.tsx

import React, { useEffect, useState, useRef } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getDiseaseInfo } from "@/services/disease.api";
import { diseaseNameMap } from "@/utils/diseaseMapping";
import { getRiskColor, getRiskEmoji } from "@/utils/risk-utils";
import { Prediction } from "@/types/prediction.types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
    visible: boolean;
    prediction: Prediction | null;
    onClose: () => void;
}

export default function HistoryDetailModal({ visible, prediction, onClose }: Props) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [info, setInfo] = useState<{ description?: string; tips?: string } | null>(null);

    useEffect(() => {
        if (visible) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    useEffect(() => {
        if (prediction) {
            const name = diseaseNameMap[prediction.fineLabel] || prediction.fineLabel;
            getDiseaseInfo(name).then(setInfo).catch(() => setInfo(null));
        }
    }, [prediction]);

    if (!prediction) return null;

    const riskColors = getRiskColor(prediction.riskLevel);
    const emoji = getRiskEmoji(prediction.riskLevel);
    const score = prediction.riskScore.toFixed(1);
    const mappedName = diseaseNameMap[prediction.fineLabel] || prediction.fineLabel;
    const coarseFineLabel = `${prediction.coarseLabel} / ${mappedName}`;

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        <Text style={styles.headerTitle}>진단 상세</Text>

                        <LinearGradient
                            colors={riskColors}
                            style={styles.resultCard}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.diseaseName}>{coarseFineLabel}</Text>
                            <Text style={styles.riskScore}>위험도 {score}점</Text>
                            <Text style={styles.riskLevel}>{prediction.riskLevel} {emoji}</Text>
                        </LinearGradient>

                        {info?.description && (
                            <View style={styles.infoCard}>
                                <View style={styles.cardHeader}>
                                    <MaterialCommunityIcons name="information-outline" size={20} color="#3b82f6" />
                                    <Text style={styles.cardTitle}>질병 정보</Text>
                                </View>
                                <Text style={styles.cardText}>{info.description}</Text>
                            </View>
                        )}

                        {info?.tips && (
                            <View style={styles.tipCard}>
                                <View style={styles.cardHeader}>
                                    <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#f59e0b" />
                                    <Text style={styles.cardTitle}>관리 팁</Text>
                                </View>
                                <Text style={styles.cardText}>{info.tips}</Text>
                            </View>
                        )}

                        <Text style={styles.disclaimer}>
                            본 예측 결과는 참고용이며, 정확한 진단 및 치료는 반드시 의사와 상담하시기 바랍니다.
                        </Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={onClose} style={styles.button}>
                                <Text style={styles.cancel}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        width: "90%",
        maxHeight: SCREEN_HEIGHT * 0.85,
        overflow: "hidden",
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        textAlign: "center",
        marginBottom: 20,
    },
    resultCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    diseaseName: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 8,
    },
    riskScore: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
    },
    riskLevel: {
        fontSize: 16,
        color: "#fff",
        marginTop: 4,
    },
    infoCard: {
        backgroundColor: "#f0f7ff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#3b82f6",
    },
    tipCard: {
        backgroundColor: "#fff9ec",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#f59e0b",
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
        color: "#111827",
    },
    cardText: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },
    disclaimer: {
        fontSize: 12,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    button: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        maxWidth: 120,
    },
    cancel: {
        color: "#000",
        fontWeight: "bold",
    },
});
