import { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Animated,
    ScrollView,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";
import BackButton from "@/common/BackButton";
import { Ionicons } from "@expo/vector-icons";
import DiseaseSelectModal from "@/modals/disease-select.modal";
import MedicationSelectModal from "@/modals/medication-select.modal";
import { fetchAllDiseases } from "@/services/disease.api";
import { fetchAllMedications } from "@/services/medication.api";
import { useQuery } from "@tanstack/react-query";

type EditableProfile = {
    name: string;
    gender: "남성" | "여성" | "";
    age: string;
    height: string;
    weight: string;
    diseases: string;
    medications: string;
};

export default function SymptomInputScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const [profile, setProfile] = useState<EditableProfile>({
        name: "홍길동",
        gender: "남성",
        age: "29",
        height: "175",
        weight: "68",
        diseases: "",
        medications: "",
    });

    const [editField, setEditField] = useState<keyof EditableProfile | null>(null);
    const [buttonState, setButtonState] = useState<"scroll" | "next">("scroll");
    const [diseaseModalOpen, setDiseaseModalOpen] = useState(false);
    const [medicationModalOpen, setMedicationModalOpen] = useState(false);

    const { data: diseaseList = [], isLoading: isDiseaseLoading } = useQuery({
        queryKey: ["diseases"],
        queryFn: fetchAllDiseases,
    });

    const { data: medicationList = [], isLoading: isMedicationLoading } = useQuery({
        queryKey: ["medications"],
        queryFn: fetchAllMedications,
    });

    const calculateBMI = (heightCm: string, weightKg: string) => {
        const height = parseFloat(heightCm) / 100;
        const weight = parseFloat(weightKg);
        if (!height || !weight) return "";
        const bmi = weight / (height * height);
        return bmi.toFixed(1);
    };

    const bmi = calculateBMI(profile.height, profile.weight);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleButtonClick = () => {
        if (buttonState === "scroll") {
            scrollViewRef.current?.scrollToEnd({ animated: true });
            setButtonState("next");
        } else if (buttonState === "next") {
            router.push("/(record)/symptomchoice");
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isScrolledToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 10;
        if (isScrolledToBottom && buttonState === "scroll") {
            setButtonState("next");
        }
    };

    const handleChange = (key: keyof EditableProfile, value: string) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
    };

    const handleEdit = (key: keyof EditableProfile) => {
        if (key === "diseases") {
            setDiseaseModalOpen(true);
        } else if (key === "medications") {
            setMedicationModalOpen(true);
        } else {
            setEditField(key);
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <BackButton />
            </View>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>기본정보를 확인해주세요</Text>
                </View>

                {/* 이름 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>이름</Text>
                        <TouchableOpacity onPress={() => setEditField("name")}>
                            <Ionicons name="create-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    {editField === "name" ? (
                        <TextInput
                            style={styles.inputValue}
                            value={profile.name}
                            onChangeText={(text) => handleChange("name", text)}
                            onBlur={() => setEditField(null)}
                            autoFocus
                        />
                    ) : (
                        <Text style={styles.inputValue}>{profile.name}</Text>
                    )}
                </View>

                {/* 성별 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>성별</Text>
                        <TouchableOpacity onPress={() => setEditField("gender")}>
                            <Ionicons name="create-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    {editField === "gender" ? (
                        <View style={styles.radioGroup}>
                            {["남성", "여성"].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={styles.radioItem}
                                    onPress={() => {
                                        handleChange("gender", item);
                                        setEditField(null);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.radioCircle,
                                            profile.gender === item && styles.radioCircleSelected,
                                        ]}
                                    />
                                    <Text style={styles.radioLabel}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.inputValue}>{profile.gender}</Text>
                    )}
                </View>

                {/* 나이 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>나이</Text>
                        <TouchableOpacity onPress={() => setEditField("age")}>
                            <Ionicons name="create-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    {editField === "age" ? (
                        <TextInput
                            style={styles.inputValue}
                            value={profile.age}
                            onChangeText={(text) => handleChange("age", text)}
                            onBlur={() => setEditField(null)}
                            autoFocus
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text style={styles.inputValue}>{profile.age}</Text>
                    )}
                </View>

                {/* 키 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>키(cm)</Text>
                        <TouchableOpacity onPress={() => setEditField("height")}>
                            <Ionicons name="create-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    {editField === "height" ? (
                        <TextInput
                            style={styles.inputValue}
                            value={profile.height}
                            onChangeText={(text) => handleChange("height", text)}
                            onBlur={() => setEditField(null)}
                            autoFocus
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text style={styles.inputValue}>{profile.height}</Text>
                    )}
                </View>

                {/* 몸무게 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>몸무게(kg)</Text>
                        <TouchableOpacity onPress={() => setEditField("weight")}>
                            <Ionicons name="create-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    {editField === "weight" ? (
                        <TextInput
                            style={styles.inputValue}
                            value={profile.weight}
                            onChangeText={(text) => handleChange("weight", text)}
                            onBlur={() => setEditField(null)}
                            autoFocus
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text style={styles.inputValue}>{profile.weight}</Text>
                    )}
                </View>

                {/* BMI */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>BMI</Text>
                    <Text style={styles.inputValue}>{bmi}</Text>
                </View>

                {/* 지병 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>지병</Text>
                        <TouchableOpacity onPress={() => handleEdit("diseases")}>
                            <Ionicons name="add" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.inputValue}>{profile.diseases || "-"}</Text>
                </View>

                {/* 복용 약물 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>복용 약물</Text>
                        <TouchableOpacity onPress={() => handleEdit("medications")}>
                            <Ionicons name="add" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.inputValue}>{profile.medications || "-"}</Text>
                </View>
            </ScrollView>

            <Animated.View
                style={[
                    styles.buttonWrapper,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
                    <Text style={styles.buttonText}>
                        {buttonState === "scroll" ? "화면 스크롤" : "다음"}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            <DiseaseSelectModal
                visible={diseaseModalOpen}
                selected={profile.diseases.split(",").map((d) => d.trim())}
                diseaseList={diseaseList}
                isLoading={isDiseaseLoading}
                onClose={() => setDiseaseModalOpen(false)}
                onSave={(items) => {
                    handleChange("diseases", items.join(", "));
                    setDiseaseModalOpen(false);
                }}
            />

            <MedicationSelectModal
                visible={medicationModalOpen}
                selected={profile.medications.split(",").map((m) => m.trim())}
                medicationList={medicationList}
                isLoading={isMedicationLoading}
                onClose={() => setMedicationModalOpen(false)}
                onSave={(items) => {
                    handleChange("medications", items.join(", "));
                    setMedicationModalOpen(false);
                }}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        paddingTop: 24,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    scrollContent: {
        paddingTop: 24,
    },
    titleWrapper: {
        marginBottom: 32,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
    },
    inputGroup: {
        marginBottom: 24,
        paddingHorizontal: 32,
    },
    inputHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    inputLabel: {
        fontSize: 14,
        color: "#6b7280",
    },
    inputValue: {
        fontSize: 17,
        color: "#000000",
        fontWeight: "500",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingVertical: 4,
    },
    radioGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginTop: 8,
    },
    radioItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: "#9CA3AF",
        marginRight: 6,
    },
    radioCircleSelected: {
        backgroundColor: "#111827",
        borderColor: "#111827",
    },
    radioLabel: {
        fontSize: 16,
        color: "#111827",
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
});
