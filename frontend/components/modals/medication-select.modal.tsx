import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Medication } from "@/types/medication.types";

interface Props {
    visible: boolean;
    selected: string[];
    medicationList: Medication[];
    isLoading?: boolean;
    onClose: () => void;
    onSave: (items: string[]) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MedicationSelectModal({
    visible,
    selected,
    medicationList,
    isLoading = false,
    onClose,
    onSave,
}: Props) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setSelectedItems(selected);
        setSearchTerm("");
    }, [visible]);

    const toggleItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredList = medicationList.filter((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={[styles.overlay, { pointerEvents: visible ? "auto" : "none" }]}>
                <View style={styles.container}>
                    <Text style={styles.title}>복용 중인 약물 선택</Text>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="검색어를 입력하세요"
                        placeholderTextColor="#9CA3AF"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />

                    {isLoading ? (
                        <ActivityIndicator size="small" color="#D92B4B" />
                    ) : (
                        <FlatList
                            data={filteredList}
                            keyExtractor={(item) => item.id}
                            style={styles.scrollArea}
                            contentContainerStyle={{ paddingBottom: 12 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => toggleItem(item.id)}
                                >
                                    <Text
                                        style={[
                                            styles.text,
                                            selectedItems.includes(item.id) && styles.selected,
                                        ]}
                                    >
                                        {item.name}{" "}
                                        {selectedItems.includes(item.id) && "✔"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={styles.cancel}>닫기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                console.log("✅ 저장할 medication ID 배열:", selectedItems);
                                onSave(selectedItems);
                            }}
                            style={styles.button}
                        >
                            <Text style={styles.confirm}>저장</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

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
        width: "100%",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    searchInput: {
        height: 40,
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        color: "black",
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
