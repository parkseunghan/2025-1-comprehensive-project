import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Animated,
    TextInput,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { fetchAllSymptoms } from "@/services/symptom.api";
import { useSymptomStore } from "@/store/symptom.store";
import { useAuthStore } from "@/store/auth.store";
import { createSymptomRecord } from "@/services/record.api";
import {
    requestPrediction,
    requestPredictionToDB,
} from "@/services/prediction.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/common/BackButton";
import SymptomSelectModal from "@/modals/symptom-select.modal";
import { Feather } from "@expo/vector-icons";
import LoadingScreen from "@/common/LoadingScreen";

export default function CategorySelectScreen() {
    const router = useRouter();
    const [categories, setCategories] = useState<string[]>([]);
    const { selected, toggle } = useSymptomStore();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [allSymptoms, setAllSymptoms] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    // ✅ 경고 배너용 상태 및 애니메이션
    const [showWarning, setShowWarning] = useState(false);
    const warningAnim = useRef(new Animated.Value(0)).current;

    const showWarningBanner = () => {
        setShowWarning(true);
        Animated.timing(warningAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.timing(warningAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setShowWarning(false));
        }, 2500);
    };

    const handlePrediction = () => {
        if (selected.length === 0) {
            showWarningBanner(); // ✅ 기존 Alert 제거
            return;
        }

        setIsLoading(true);

        setTimeout(async () => {
            try {
                const record = await createSymptomRecord({
                    userId: user!.id,
                    symptoms: selected,
                });

                await AsyncStorage.setItem("lastRecordId", record.id);

                const aiPrediction = await requestPrediction({
                    symptomKeywords: selected,
                    age: user?.age || 0,
                    gender: user?.gender || "",
                    height: user?.height || 0,
                    weight: user?.weight || 0,
                    bmi: user?.bmi || 0,
                    diseases: user?.diseases?.map((d) => d.name) || [],
                    medications: user?.medications?.map((m) => m.name) || [],
                });

                const predictionRanks = aiPrediction.predictions.map(
                    (pred, i) => ({
                        rank: i + 1,
                        coarseLabel: pred.coarseLabel,
                        fineLabel: pred.fineLabel,
                        riskScore: pred.riskScore,
                    })
                );

                await requestPredictionToDB({
                    recordId: record.id,
                    predictions: predictionRanks,
                    age: user?.age || 0,
                    bmi: user?.bmi || 0,
                    gender: user?.gender || "",
                    diseases: user?.diseases?.map((d) => d.name) || [],
                    medications: user?.medications?.map((m) => m.name) || [],
                    symptomKeywords: selected,
                });

                router.push("/(record)/result");
            } catch (error: any) {
                console.error("❌ 예측 실패:", error);
                if (Platform.OS !== "web") {
                    Alert.alert(
                        "예측 실패",
                        error?.response?.data?.message || "문제가 발생했습니다."
                    );
                }
            } finally {
                setIsLoading(false);
            }
        }, 500);
    };

    const openModal = (category: string) => {
        setSelectedCategory(category);
        setModalVisible(true);
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const symptoms = await fetchAllSymptoms();
                const categorySet = new Set(symptoms.map((s) => s.category));
                setCategories(Array.from(categorySet));
                setAllSymptoms(symptoms);
            } catch (err) {
                console.error("❌ symptom fetch error:", err);
            }
        };

        fetch();

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const filteredSymptoms = allSymptoms.filter((s) =>
        s.name.includes(searchTerm.trim())
    );

    return (
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton fallbackRoute="/(record)/symptomchoice" />
                    </View>

                    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <View style={styles.titleBlock}>
                                <Text style={styles.title}>
                                    증상을 검색하거나 대분류를 선택하세요.
                                </Text>
                                <Text style={styles.noticeLine}>
                                    ℹ️ 2개 이상의 증상을 선택해주세요.
                                </Text>
                            </View>

                            {selected.length > 0 && (
                                <View style={styles.selectedBox}>
                                    {selected.map((name) => (
                                        <TouchableOpacity
                                            key={name}
                                            style={styles.chip}
                                            onPress={() => toggle(name)}
                                        >
                                            <Text style={styles.chipText}>
                                                {name} ✕
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            <View style={styles.searchWrapper}>
                                <Feather
                                    name="search"
                                    size={18}
                                    color="#9CA3AF"
                                    style={styles.searchIcon}
                                />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="현재 증상을 검색하세요."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    placeholderTextColor="#6B7280"
                                />
                            </View>

                            {searchTerm.trim().length > 0
                                ? filteredSymptoms.map((s) => (
                                      <TouchableOpacity
                                          key={s.id}
                                          style={styles.item}
                                          onPress={() => toggle(s.name)}
                                      >
                                          <Text
                                              style={[
                                                  styles.itemText,
                                                  selected.includes(s.name) && {
                                                      color: "#D92B4B",
                                                      fontWeight: "bold",
                                                  },
                                              ]}
                                          >
                                              {s.name}{" "}
                                              {selected.includes(s.name) && "✔"}
                                          </Text>
                                      </TouchableOpacity>
                                  ))
                                : categories.map((category) => (
                                      <TouchableOpacity
                                          key={category}
                                          style={styles.item}
                                          onPress={() => openModal(category)}
                                      >
                                          <Text style={styles.itemText}>
                                              {category}
                                          </Text>
                                      </TouchableOpacity>
                                  ))}
                        </ScrollView>

                        <Animated.View
                            style={[
                                styles.buttonWrapper,
                                { transform: [{ translateY }] },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handlePrediction}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>예측하기</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                </View>
            )}

            {/* ✅ 증상 선택 모달 */}
            <SymptomSelectModal
                visible={modalVisible}
                category={selectedCategory}
                onClose={() => setModalVisible(false)}
            />

            {/* ✅ 경고 배너 */}
            {showWarning && (
                <Animated.View
                    style={[
                        styles.warningBanner,
                        {
                            transform: [
                                {
                                    translateY: warningAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [100, 0],
                                    }),
                                },
                            ],
                            opacity: warningAnim,
                        },
                    ]}
                >
                    <Feather name="alert-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.warningText}>최소 한 가지 증상을 선택해 주세요.</Text>
                </Animated.View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 24,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
    },
    scrollContent: {
        paddingBottom: 80,
    },
    titleBlock: {
        marginBottom: 12,
        marginTop: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 2,
        color: "#111827",
    },
    noticeLine: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 12,
    },
    selectedBox: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    chip: {
        backgroundColor: "#f3f4f6",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        margin: 4,
    },
    chipText: {
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
    item: {
        padding: 14,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 12,
        borderColor: "#E5E7EB",
    },
    itemText: {
        fontSize: 16,
    },
    buttonWrapper: {
        padding: 16,
        backgroundColor: "#ffffff",
    },
    button: {
        backgroundColor: "#D92B4B",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    warningBanner: {
        position: "absolute",
        bottom: 80,
        left: 20,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: "#DC2626",
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    warningText: {
        color: "#ffffff",
        fontSize: 14,
        flexShrink: 1,
    },
});
