import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Disease } from "@/types/disease.types";

interface Props {
    visible: boolean;
    category: string;
    diseaseList: Disease[];
    selected: string[];
    onToggle: (id: string[]) => void;
    onSave: () => void;
    onBack: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function DiseaseListSelectModal({
    visible,
    category,
    diseaseList,
    selected,
    onToggle,
    onSave,
    onBack,
}: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [tempSelected, setTempSelected] = useState<string[]>([]);

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            setTempSelected(selected);
            setSearchQuery("");
        }
    }, [visible, selected]);

    useEffect(() => {
        const showListener = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setIsKeyboardVisible(true);
        });
        const hideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
            setIsKeyboardVisible(false);
        });
        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    const toggleItem = (id: string) => {
        setTempSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filtered = diseaseList
        .filter((d) => d.category === category)
        .filter((d) => d.name.includes(searchQuery));

    const getContainerMaxHeight = () => {
        if (isKeyboardVisible) {
            return SCREEN_HEIGHT - keyboardHeight - 50;
        }
        return SCREEN_HEIGHT * 0.85;
    };

    const getListMaxHeight = () => {
        const baseHeight = 150;
        const maxContentHeight = SCREEN_HEIGHT * 0.8 - baseHeight;
        if (isKeyboardVisible) {
            const availableHeight = SCREEN_HEIGHT - keyboardHeight - 140;
            return Math.min(availableHeight, maxContentHeight);
        }
        const itemHeight = 48;
        const neededHeight = filtered.length * itemHeight;
        const dynamicHeight = Math.min(neededHeight, maxContentHeight);
        return Math.max(dynamicHeight, 120);
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onBack}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={[styles.overlay, { pointerEvents: visible ? "auto" : "none" }]}>
                    <View style={[styles.container, { maxHeight: getContainerMaxHeight() }]}>
                        <Text style={styles.title}>{category} 관련 질병</Text>

                        <View style={styles.searchWrapper}>
                            <Feather name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput
                                placeholder="질병명을 입력하세요"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={styles.searchInput}
                                placeholderTextColor="#6B7280"
                            />
                        </View>

                        <ScrollView
                            style={[styles.scrollArea, { maxHeight: getListMaxHeight() }]}
                            keyboardShouldPersistTaps="handled"
                        >
                            {filtered.map((d) => (
                                <TouchableOpacity
                                    key={d.sickCode}
                                    onPress={() => toggleItem(d.sickCode)}
                                    style={styles.item}
                                >
                                    <Text
                                        style={[
                                            styles.text,
                                            tempSelected.includes(d.sickCode) && styles.selected,
                                        ]}
                                    >
                                        {d.name} {tempSelected.includes(d.sickCode) && "✔"}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            {filtered.length === 0 && (
                                <Text style={styles.noResult}>일치하는 질병이 없습니다.</Text>
                            )}
                        </ScrollView>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={onBack} style={styles.button}>
                                <Text style={styles.cancel}>뒤로가기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    onToggle(tempSelected);
                                    onSave();
                                }}
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
        minHeight: 230,
        width: "100%",
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
    scrollArea: {
        marginBottom: 12,
        flexShrink: 1,
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
    noResult: {
        padding: 8,
        color: "#9CA3AF",
        textAlign: "center",
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
