import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchAllDiseases } from "@/services/disease.api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/common/BackButton";
import { Disease } from "@/types/disease.types";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState, useRef, useEffect } from "react";
import DiseaseDetailModal from "@/modals/disease-detail.modal";

export default function DiseaseScreen() {
    const { data, isLoading, error } = useQuery<Disease[]>({
        queryKey: ["diseases"],
        queryFn: fetchAllDiseases,
    });

    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // 애니메이션 상태
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

    const filteredDiseases = useMemo(() => {
        if (!data) return [];
        return data.filter((d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    if (isLoading) return <Text style={styles.centerText}>불러오는 중...</Text>;
    if (error) return <Text style={styles.centerText}>에러 발생!</Text>;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* 🔹 헤더 (애니메이션 없음) */}
            <View style={styles.header}>
                <BackButton />
                <View style={styles.headerTitleWrapper}>
                    <Text style={styles.title}>질병 도감</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* 🔍 검색창 (애니메이션 없음) */}
            <View style={styles.searchWrapper}>
                <Feather
                    name="search"
                    size={18}
                    color="#9CA3AF"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="궁금한 질병이 있으신가요?"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#6B7280"
                />
            </View>

            {/* 🔽 애니메이션 적용 영역 */}
            <Animated.View
                style={{
                    flex: 1,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }}
            >
                <FlatList
                    data={filteredDiseases}
                    keyExtractor={(item) => item.sickCode}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedDisease(item);
                                setModalVisible(true);
                            }}
                        >
                            <View style={styles.card}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.desc} numberOfLines={2}>
                                    {item.description || "설명 없음"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                    )}
                />

                <DiseaseDetailModal
                    visible={modalVisible}
                    disease={selectedDisease}
                    onClose={() => setModalVisible(false)}
                />

                <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
                    <Text style={styles.footerText}>
                        ※ 본 질병 정보는 건강보험심사평가원 API를 기반으로 하며,{"\n"}
                        공공누리 제1유형(출처표시)에 따라 자유롭게 이용할 수 있습니다.
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
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
        color: "#111827",
    },
    desc: {
        fontSize: 13,
        color: "#4b5563",
        lineHeight: 18,
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
