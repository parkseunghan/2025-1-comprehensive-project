// 📄 src/components/modals/disease-select.modal.tsx

// 🔹 지병 선택 모달 컴포넌트
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
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 🔸 컴포넌트에 전달받는 props 타입 정의
interface Props {
    visible: boolean; // 모달 창 열림 여부
    selected: string[]; // 현재 선택된 지병 배열
    diseaseList: string[]; // 전체 지병 목록
    isLoading?: boolean; // 로딩 상태 (fetch 중)
    onClose: () => void; // 모달 닫기 핸들러
    onSave: (items: string[]) => void; // 선택된 값 저장 핸들러
}

export default function DiseaseSelectModal({
    visible,
    selected,
    diseaseList,
    isLoading = false,
    onClose,
    onSave,
}: Props) {
    // ✅ 선택된 아이템을 로컬 상태로 저장
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // ✅ 모달이 열릴 때마다 외부 selected 값으로 초기화
    useEffect(() => {
        setSelectedItems(selected);
    }, [visible]);

    // ✅ 선택/해제 로직
    const toggleItem = (item: string) => {
        setSelectedItems((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
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
                            keyExtractor={(item) => item}
                            style={styles.list}
                            contentContainerStyle={{ paddingBottom: 12 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.itemRow}
                                    onPress={() => toggleItem(item)}
                                >
                                    <Ionicons
                                        name={
                                            selectedItems.includes(item)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={20}
                                        color="#111827"
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>닫기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onSave(selectedItems)}>
                            <Text style={styles.saveText}>저장</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// 🔸 스타일 정의
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    container: {
        width: "85%",
        maxHeight: "80%", // ✅ 최대 높이 제한
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
        maxHeight: 300, // ✅ FlatList 높이 제한 (scroll 가능하게)
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
