import React, { useEffect, useRef } from "react";
import {
    Modal,
    View,
    Platform,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from "react-native";
import { Disease } from "@/types/disease.types";

interface Props {
    visible: boolean;
    disease: Disease | null;
    onClose: () => void;
}

export default function DiseaseDetailModal({ visible, disease, onClose }: Props) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [visible]);

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        opacity: fadeAnim,
                        pointerEvents: visible ? "auto" : "none",
                    },
                ]}
            >
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>{disease?.name}</Text>

                    {disease?.englishName && (
                        <Text style={styles.englishName}>
                            ({disease.englishName})
                        </Text>
                    )}

                    <Text style={styles.desc}>
                        {disease?.description || "설명 없음"}
                    </Text>

                    {disease && (
                        <Text style={styles.tip}>
                            💡 {disease.tips?.trim() ? disease.tips : "tips 없음"}
                        </Text>
                    )}

                    {/* ✅ 버튼 중앙 정렬 + 동일한 스타일 */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={styles.cancel}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    content: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 16,
        width: "85%",
        ...Platform.select({
            web: {
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            },
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    englishName: {
        fontSize: 14,
        fontStyle: "italic",
        color: "#6B7280",
        marginBottom: 12,
    },
    desc: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 10,
        lineHeight: 20,
    },
    tip: {
        fontSize: 13,
        color: "#10b981",
        marginBottom: 16,
        lineHeight: 20,
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
        maxWidth: 120, // 버튼 폭 고정
    },
    cancel: {
        color: "#000",
        fontWeight: "bold",
    },
});
