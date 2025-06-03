import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    TextInput,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Disease } from "@/types/disease.types";

interface Props {
    visible: boolean;
    categories: string[];
    diseaseList: Disease[];
    selected: string[];
    onSelectDiseases: (ids: string[]) => void;
    onClose: () => void;
    onOpenSubcategory: (category: string) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function DiseaseCategorySelectModal({
    visible,
    categories,
    diseaseList,
    selected,
    onSelectDiseases,
    onClose,
    onOpenSubcategory,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSelected, setTempSelected] = useState<string[]>([]);

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            setSearchTerm("");
            setTempSelected(selected);
        }
    }, [visible, selected]);

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setIsKeyboardVisible(true);
        });
        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
            setIsKeyboardVisible(false);
        });
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const toggleDisease = (id: string) => {
        setTempSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredDiseases = diseaseList.filter((d) =>
        d.name.includes(searchTerm)
    );
    const showSearchResults = searchTerm.trim().length > 0;

    const getContainerMaxHeight = () => {
        if (isKeyboardVisible) {
            return SCREEN_HEIGHT - keyboardHeight - 50;
        }
        return SCREEN_HEIGHT * 0.85;
    };

    const getModalHeight = () => {
        const baseHeight = 160;
        const maxContentHeight = SCREEN_HEIGHT * 0.8 - baseHeight;
        if (isKeyboardVisible) {
            const availableHeight = SCREEN_HEIGHT - keyboardHeight - 140;
            return Math.min(availableHeight, maxContentHeight);
        }
        const itemHeight = 50;
        const neededHeight = filteredDiseases.length * itemHeight;
        const dynamicHeight = Math.min(neededHeight, maxContentHeight);
        return Math.max(dynamicHeight, 150);
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.overlay}>
                    <View style={[styles.container, { maxHeight: getContainerMaxHeight() }]}>
                        <Text style={styles.title}>지병 선택</Text>

                        <View style={styles.searchWrapper}>
                            <Feather name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput
                                placeholder="질병명을 입력하세요"
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                style={styles.searchInput}
                                placeholderTextColor="#6B7280"
                            />
                        </View>

                        <ScrollView
                            style={[styles.scrollArea, { maxHeight: getModalHeight() }]}
                            contentContainerStyle={{ paddingBottom: 12 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {showSearchResults ? (
                                filteredDiseases.length > 0 ? (
                                    filteredDiseases.map((d) => (
                                        <TouchableOpacity
                                            key={d.sickCode}
                                            onPress={() => toggleDisease(d.sickCode)}
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
                                    ))
                                ) : (
                                    <Text style={styles.noResult}>일치하는 질병이 없습니다.</Text>
                                )
                            ) : (
                                categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => onOpenSubcategory(cat)}
                                        style={styles.item}
                                    >
                                        <Text style={styles.text}>{cat}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={onClose} style={styles.button}>
                                <Text style={styles.cancel}>닫기</Text>
                            </TouchableOpacity>
                            {showSearchResults && (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelectDiseases(tempSelected);
                                        onClose();
                                    }}
                                    style={styles.button}
                                >
                                    <Text style={styles.confirm}>선택 저장</Text>
                                </TouchableOpacity>
                            )}
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
    scrollArea: {
        marginBottom: 12,
        flexShrink: 1,
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
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
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        gap: 12,
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
