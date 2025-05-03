// 🔹 src/components/modals/disease-select.modal.tsx

// 🔹 지병 선택 모달 콘텐츠
// 사용자가 다중 선택 방식으로 지병을 선택할 수 있도록 보여주는 팝업 창입니다.

import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Disease } from "@/types/disease.types";


interface Props {
    visible: boolean; // 모달 창 열림 유무
    selected: string[]; // 현재 선택된 지병 ID 배열
    diseaseList: Disease[]; // 전체 지병 목록
    isLoading?: boolean; // 로딩 상태 (fetch 중)
    onClose: () => void; // 모달 닫기 핸드러
    onSave: (items: string[]) => void; // 선택된 값 저장 핸드러
}

export default function DiseaseSelectModal({
    visible,
    selected,
    diseaseList,
    isLoading = false,
    onClose,
    onSave,
}: Props) {
    // ✅ 선택된 아이템을 로컴 상태로 저장
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // ✅ 모달이 열리는 해당 외부 selected 값으로 초기화
    useEffect(() => {
        const validIds = selected.filter((id) =>
            diseaseList.some((d) => d.sickCode === id)
        );
        setSelectedItems(validIds);
    }, [visible]);

    // ✅ 선택/해제 로직
    const toggleItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>지병 선택</Text>

                    {isLoading ? (
                        <ActivityIndicator size="small" color="#D92B4B" />
                    ) : (
                        <FlatList
                        data={diseaseList}
                        keyExtractor={(item) => item.sickCode}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                            style={styles.itemRow}
                            onPress={() => toggleItem(item.sickCode)}
                            >
                            <Ionicons
                                name={selectedItems.includes(item.sickCode) ? "checkbox" : "square-outline"}
                                size={20}
                                color="#111827"
                                style={{ marginRight: 8 }}
                            />
                            <Text>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        />
                    )}

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>닫기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const confirmedIds = selectedItems.filter((id) =>
                                    diseaseList.some((d) => d.sickCode === id)
                                );
                                console.log("✅ 저장할 disease ID 배열 (필터링됨):", confirmedIds);
                                onSave(confirmedIds);
                            }}
                        >
                            <Text style={styles.saveText}>저장</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// 🔸 스킬 정의
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    container: {
        width: "85%",
        maxHeight: "80%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    list: {
        maxHeight: 300,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    footer: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    closeText: {
        color: "#6B7280",
        fontSize: 15,
    },
    saveText: {
        color: "#D92B4B",
        fontWeight: "bold",
        fontSize: 15,
    },
});
