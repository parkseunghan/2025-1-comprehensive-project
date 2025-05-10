// 📄 components/modals/medication-detail.modal.tsx

import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Medication } from "@/types/medication.types";
import { Feather } from "@expo/vector-icons";

interface Props {
    visible: boolean;
    onClose: () => void;
    medication: Medication | null;
}

export default function MedicationDetailModal({ visible, onClose, medication }: Props) {
    if (!medication) return null;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* 상단 닫기 버튼 */}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Feather name="x" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    <ScrollView>
                        <Text style={styles.title}>{medication.name}</Text>

                        <Text style={styles.label}>💬 설명</Text>
                        <Text style={styles.content}>
                            {medication.description || "설명 정보가 없습니다."}
                        </Text>

                        <Text style={styles.label}>💡 복용 팁</Text>
                        <Text style={styles.content}>
                            {medication.tips || "복용 팁 정보가 없습니다."}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modal: {
        width: "100%",
        maxHeight: "85%",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 20,
    },
    closeBtn: {
        position: "absolute",
        right: 12,
        top: 12,
        zIndex: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        marginTop: 14,
        marginBottom: 6,
        color: "#4B5563",
    },
    content: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 22,
    },
});
