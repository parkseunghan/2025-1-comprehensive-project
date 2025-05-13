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

    // ✅ fade-only 애니메이션
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // fade 초기화
            fadeAnim.setValue(0);

            // 애니메이션 실행
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();

            // 증상 데이터 로드
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

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>{category} 증상 선택</Text>

                    {loading ? (
                        <ActivityIndicator color="#D92B4B" />
                    ) : (
                        <ScrollView style={{ marginBottom: 20 }}>
                            {symptoms.map((s) => (
                                <TouchableOpacity
                                    key={s.id}
                                    style={[
                                        styles.item,
                                        selected.includes(s.name) && styles.itemSelected,
                                    ]}
                                    onPress={() => toggle(s.name)}
                                >
                                    <Text
                                        style={[
                                            styles.itemText,
                                            selected.includes(s.name) && styles.itemTextSelected,
                                        ]}
                                    >
                                        {s.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>확인</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    item: {
        padding: 14,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 12,
        borderColor: "#E5E7EB",
    },
    itemSelected: {
        backgroundColor: "#D92B4B",
    },
    itemText: {
        fontSize: 16,
        color: "#374151",
    },
    itemTextSelected: {
        color: "#ffffff",
    },
    closeButton: {
        backgroundColor: "#D92B4B",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    closeText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
