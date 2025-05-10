import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState, useMemo } from "react";

import BackButton from "@/common/BackButton";
import { Medication } from "@/types/medication.types";
import { fetchAllMedications } from "@/services/medication.api";
import MedicationDetailModal from "@/modals/medication-detail.modal";

export default function MedicationScreen() {
    const { data, isLoading, error } = useQuery<Medication[]>({
        queryKey: ["medications"],
        queryFn: fetchAllMedications,
    });

    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const filteredList = useMemo(() => {
        if (!searchQuery.trim()) return data;
        return data?.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }, [searchQuery, data]);

    const handlePressMedication = (med: Medication) => {
        setSelectedMedication(med);
        setModalVisible(true);
    };

    if (isLoading) return <Text style={styles.center}>불러오는 중...</Text>;
    if (error) return <Text style={styles.center}>에러 발생!</Text>;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <BackButton />
            </View>

            <Text style={styles.title}>💊 약물 도감</Text>

            <TextInput
                style={[
                    styles.searchInput,
                    {
                        borderColor: isFocused ? "#D92B4B" : "#999",
                        color: "#111",
                    },
                ]}
                placeholder="약물명을 검색하세요"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholderTextColor="#999"
            />

            <FlatList
                data={filteredList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePressMedication(item)} style={styles.itemBox}>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {selectedMedication && (
                <MedicationDetailModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    medication={selectedMedication}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#F4F1FF",
    },
    header: {
        paddingTop: 24,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        marginVertical: 12,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    searchInput: {
        height: 44,
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: "#ffffff",
    },
    itemBox: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "#ffffff",
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
    },
    itemText: {
        fontSize: 16,
        color: "#111827",
        fontWeight: "500",
    },
});
