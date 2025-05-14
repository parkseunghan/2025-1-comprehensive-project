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
} from "react-native";
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

    useEffect(() => {
        if (visible) {
            setSearchTerm("");
            setTempSelected(selected);
        }
    }, [visible]);

    const toggleDisease = (id: string) => {
        setTempSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredDiseases = diseaseList.filter((d) =>
        d.name.includes(searchTerm)
    );

    const showSearchResults = searchTerm.trim().length > 0;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>지병 선택</Text>

                    <TextInput
                        placeholder="질병명을 입력하세요"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        style={styles.searchInput}
                        placeholderTextColor="#9CA3AF"
                    />

                    <ScrollView
                        style={styles.scrollArea}
                        contentContainerStyle={{ paddingBottom: 12 }}
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
                                                tempSelected.includes(d.sickCode) &&
                                                    styles.selected,
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
