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
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
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
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        setSelectedItems(selected);
        setSearchTerm("");
    }, [visible]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener?.remove();
            keyboardDidShowListener?.remove();
        };
    }, []);

    const toggleItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredList = medicationList.filter((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getModalHeight = () => {
        const baseHeight = 200;
        const maxContentHeight = SCREEN_HEIGHT * 0.8 - baseHeight;

        if (isKeyboardVisible) {
            const availableHeight = SCREEN_HEIGHT - keyboardHeight - 100;
            return Math.min(availableHeight, maxContentHeight);
        }

        const itemHeight = 50;
        const neededHeight = filteredList.length * itemHeight;
        const dynamicHeight = Math.min(neededHeight, maxContentHeight);

        return Math.max(dynamicHeight, 200);
    };

    const getContainerMaxHeight = () => {
        if (isKeyboardVisible) {
            return SCREEN_HEIGHT - keyboardHeight - 50;
        }
        return SCREEN_HEIGHT * 0.85;
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={[styles.overlay, { pointerEvents: visible ? "auto" : "none" }]}>
                    <View
                        style={[
                            styles.container,
                            {
                                maxHeight: getContainerMaxHeight(),
                                marginBottom: isKeyboardVisible ? 20 : 0,
                            },
                        ]}
                    >
                        <Text style={styles.title}>복용 중인 약물 선택</Text>

                        <View style={styles.searchWrapper}>
                            <Feather name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput
                                placeholder="검색어를 입력하세요"
                                placeholderTextColor="#6B7280"
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                style={styles.searchInput}
                            />
                        </View>

                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#D92B4B" />
                            </View>
                        ) : (
                            <FlatList
                                data={filteredList}
                                keyExtractor={(item) => item.id}
                                style={[styles.scrollArea, { maxHeight: getModalHeight(), flexGrow: 0 }]}
                                contentContainerStyle={{
                                    paddingBottom: 12,
                                    flexGrow: filteredList.length === 0 ? 1 : 0,
                                }}
                                showsVerticalScrollIndicator={filteredList.length > 5}
                                nestedScrollEnabled
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
                                ListEmptyComponent={() => (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>
                                            {searchTerm ? "검색 결과가 없습니다" : "약물 목록이 없습니다"}
                                        </Text>
                                    </View>
                                )}
                            />
                        )}

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={onClose} style={styles.button}>
                                <Text style={styles.cancel}>닫기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onSave(selectedItems)}
                                style={styles.button}
                            >
                                <Text style={styles.confirm}>저장</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
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
        width: "100%",
        minHeight: 250,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    searchWrapper: {
        position: "relative",
        marginBottom: 12,
    },
    searchIcon: {
        position: "absolute",
        top: 12,
        left: 10,
        zIndex: 1,
    },
    searchInput: {
        borderWidth: 1.5,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 36,
        fontSize: 15,
        color: "#111827",
        backgroundColor: "#fff",
        borderColor: "#D92B4B",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 100,
    },
    scrollArea: {
        marginBottom: 12,
        flexShrink: 1,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: "#E5E7EB",
    },
    text: {
        fontSize: 16,
        lineHeight: 20,
    },
    selected: {
        color: "#D92B4B",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        color: "#9CA3AF",
        fontSize: 16,
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
        marginTop: 8,
    },
    button: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    cancel: {
        color: "#000",
        fontWeight: "bold",
    },
    confirm: {
        color: "#D92B4B",
        fontWeight: "bold",
    },
});
