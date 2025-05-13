import React, { useEffect, useState, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Dimensions,
} from "react-native";
import { fetchAllSymptoms } from "@/services/symptom.api";
import { Symptom } from "@/types/symptom.types";
import { useSymptomStore } from "@/store/symptom.store";

interface Props {
    visible: boolean;
    category: string;
    onClose: () => void;
}

export default function SymptomSelectModal({ visible, category, onClose }: Props) {
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [loading, setLoading] = useState(false);
    const { selected, toggle } = useSymptomStore();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    // ✅ 모달 전용 선택 상태 (로컬)
    const [localSelected, setLocalSelected] = useState<string[]>([]);

    // ✅ 모달 열릴 때 현재 상태 복사
    useEffect(() => {
        if (visible) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();

            setLocalSelected([...selected]);

            const fetchSymptoms = async () => {
                setLoading(true);
                try {
                    const all = await fetchAllSymptoms();
                    const filtered = all.filter((s) => s.category === category);
                    setSymptoms(filtered);
                } catch (e) {
                    console.error("❌ 증상 불러오기 실패:", e);
                } finally {
                    setLoading(false);
                }
            };

            fetchSymptoms();
        }
    }, [visible]);

    // ✅ 항목 선택 토글 (localSelected만 변경)
    const handleToggle = (name: string) => {
        if (localSelected.includes(name)) {
            setLocalSelected((prev) => prev.filter((n) => n !== name));
        } else {
            setLocalSelected((prev) => [...prev, name]);
        }
    };

    // ✅ 확인 → 실제 toggle 반영
    const handleConfirm = () => {
        // 기존 selected → localSelected로 맞추기
        const toAdd = localSelected.filter((item) => !selected.includes(item));
        const toRemove = selected.filter((item) => !localSelected.includes(item));

        toAdd.forEach((item) => toggle(item));
        toRemove.forEach((item) => toggle(item));

        onClose();
    };

    // ✅ 취소 → 아무 것도 안 바꾸고 닫기
    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, { pointerEvents: visible ? "auto" : "none" }]}>
                <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>{category} 증상 선택</Text>

                    {loading ? (
                        <ActivityIndicator color="#D92B4B" />
                    ) : (
                        <ScrollView style={styles.scrollArea}>
                            {symptoms.map((s) => (
                                <TouchableOpacity
                                    key={s.id}
                                    style={styles.item}
                                    onPress={() => handleToggle(s.name)}
                                >
                                    <Text
                                        style={[
                                            styles.text,
                                            localSelected.includes(s.name) && styles.selected,
                                        ]}
                                    >
                                        {s.name} {localSelected.includes(s.name) && "✔"}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={handleCancel} style={styles.button}>
                            <Text style={styles.cancel}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm} style={styles.button}>
                            <Text style={styles.confirm}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingHorizontal: 16,
    },
    container: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        maxHeight: SCREEN_HEIGHT * 0.8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    scrollArea: {
        maxHeight: SCREEN_HEIGHT * 0.5,
        marginBottom: 12,
    },
    item: {
        paddingVertical: 10,
    },
    text: {
        fontSize: 16,
    },
    selected: {
        color: "#D92B4B",
        fontWeight: "bold",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
    },
    button: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#f9fafb",
    },
    cancel: {
        color: "#6B7280",
        fontWeight: "bold",
    },
    confirm: {
        color: "#D92B4B",
        fontWeight: "bold",
    },
});
