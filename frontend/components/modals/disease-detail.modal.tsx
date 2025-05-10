import React, { useEffect, useRef } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
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
                useNativeDriver: true,
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
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>{disease?.name}</Text>
                    <Text style={styles.desc}>{disease?.description || "설명 없음"}</Text>
                    {disease?.tips && (
                        <Text style={styles.tip}>💡 {disease.tips}</Text>
                    )}
                    <Pressable onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>닫기</Text>
                    </Pressable>
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    desc: {
        fontSize: 14,
        color: "#4b5563",
        marginBottom: 10,
    },
    tip: {
        fontSize: 13,
        color: "#10b981",
        marginBottom: 16,
    },
    closeBtn: {
        alignSelf: "flex-end",
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#7F66FF",
        borderRadius: 8,
    },
    closeText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
