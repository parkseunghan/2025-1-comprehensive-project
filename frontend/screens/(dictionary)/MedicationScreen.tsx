import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Animated,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMedications } from "@/services/medication.api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/common/BackButton";
import { Medication } from "@/types/medication.types";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState, useRef, useEffect } from "react";
import MedicationDetailModal from "@/modals/medication-detail.modal";
import AJINGA_LOGO from "@/images/AJINGA_LOGO.png";

const extractItemName = (rawName: string): string =>
    rawName.replace(/\(수출명\s*:\s*.*?\)/g, "").trim();

const extractExportName = (rawName: string): string | null => {
    const match = rawName.match(/\(수출명\s*:\s*(.*?)\)/);
    return match?.[1]?.trim() || null;
};

export default function MedicationScreen() {
    const { data, isLoading, error } = useQuery<Medication[]>({
        queryKey: ["medications"],
        queryFn: fetchAllMedications,
    });

    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMedication, setSelectedMedication] = useState<
        (Medication & { exportNameParsed?: string }) | null
    >(null);
    const [modalVisible, setModalVisible] = useState(false);

    // 등장 애니메이션
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const filteredMedications = useMemo(() => {
        if (!data) return [];
        return data.filter((m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const handlePressMedication = (med: Medication) => {
        setSelectedMedication({
            ...med,
            exportNameParsed: extractExportName(med.name),
        });
        setModalVisible(true);
    };

    if (isLoading) return <Text style={styles.centerText}>불러오는 중...</Text>;
    if (error) return <Text style={styles.centerText}>에러 발생!</Text>;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* 고정 헤더 */}
            <View style={styles.header}>
                <BackButton />
                <View style={styles.headerTitleWrapper}>
                    <Text style={styles.title}>약물 도감</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* 고정 검색창 */}
            <View style={styles.searchWrapper}>
                <Feather
                    name="search"
                    size={18}
                    color="#9CA3AF"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="궁금한 약물이 있으신가요?"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#6B7280"
                />
            </View>

            {/* 애니메이션 적용 영역 */}
            <Animated.View
                style={{
                    flex: 1,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }}
            >
                <FlatList
                    data={filteredMedications}
                    keyExtractor={(item) => item.itemSeq}
                    renderItem={({ item }) => {
                        const displayName = extractItemName(item.name);
                        const exportName = extractExportName(item.name);

                        return (
                            <TouchableOpacity onPress={() => handlePressMedication(item)}>
                                <View style={styles.card}>
                                    <Image
                                        source={item.imageUrl ? { uri: item.imageUrl } : AJINGA_LOGO}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.cardText}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {exportName && (
                                                <View style={styles.exportTagBox}>
                                                    <Text style={styles.exportTag}>수출용</Text>
                                                </View>
                                            )}
                                            <Text style={styles.name}>{displayName}</Text>
                                        </View>
                                        <Text style={styles.efcy} numberOfLines={2}>
                                            {item.efcy || "효능 정보 없음"}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    contentContainerStyle={{
                        paddingBottom: insets.bottom + 120,
                    }}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                    )}
                />

                <MedicationDetailModal
                    visible={modalVisible}
                    medication={selectedMedication}
                    onClose={() => setModalVisible(false)}
                />

                <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
                    <Text style={styles.footerText}>
                        ※ 본 약물 정보는 식품의약품안전처 e약은요 API를 통해 수집되었으며,{"\n"}
                        별도의 이용 제한 없이 자유롭게 활용 가능합니다.
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 30,
        marginBottom: 25,
    },
    headerTitleWrapper: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
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
    card: {
        flexDirection: "row",
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 8,
        alignItems: "center",
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: "#E5E7EB",
    },
    cardText: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    efcy: {
        fontSize: 13,
        color: "#4b5563",
        marginTop: 4,
        lineHeight: 18,
    },
    exportTagBox: {
        backgroundColor: "#EDE9FE",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: 6,
    },
    exportTag: {
        fontSize: 11,
        fontWeight: "600",
        color: "#5B21B6",
    },
    emptyText: {
        textAlign: "center",
        color: "#9CA3AF",
        fontSize: 14,
        marginTop: 40,
    },
    centerText: {
        textAlign: "center",
        marginTop: 30,
    },
    footer: {
        marginTop: 12,
        backgroundColor: "#fff",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
    },
    footerText: {
        fontSize: 11,
        lineHeight: 16,
        color: "#6b7280",
        textAlign: "center",
    },
});
