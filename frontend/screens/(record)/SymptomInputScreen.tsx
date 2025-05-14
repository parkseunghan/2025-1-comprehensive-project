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
    Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation } from "@tanstack/react-query";

import BackButton from "@/common/BackButton";
import DiseaseCategorySelectModal from "@/modals/disease-category-select.modal";
import DiseaseListSelectModal from "@/modals/diseaselist-select.modal";
import MedicationSelectModal from "@/modals/medication-select.modal";

import { fetchAllDiseases } from "@/services/disease.api";
import { fetchAllMedications } from "@/services/medication.api";
import { fetchCurrentUser, updateUserProfile } from "@/services/user.api";
import { useAuthStore } from "@/store/auth.store";

export default function SymptomInputScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const { user, token, setAuth } = useAuthStore();

    const { data: diseaseList = [] } = useQuery({
        queryKey: ["diseases"],
        queryFn: fetchAllDiseases,
    });

    const { data: medicationList = [] } = useQuery({
        queryKey: ["medications"],
        queryFn: fetchAllMedications,
    });

    const { data: profile } = useQuery({
        queryKey: ["user", user?.id],
        queryFn: () => fetchCurrentUser(user!.id),
        enabled: !!user?.id,
    });

    const [profileState, setProfileState] = useState({
        name: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
    });

    const [selectedDiseaseIds, setSelectedDiseaseIds] = useState<string[]>([]);
    const [selectedMedicationIds, setSelectedMedicationIds] = useState<
        string[]
    >([]);

    const [editField, setEditField] = useState<
        keyof typeof profileState | null
    >(null);
    const [buttonState, setButtonState] = useState<"scroll" | "next">("scroll");

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [listModalOpen, setListModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [medicationModalOpen, setMedicationModalOpen] = useState(false);

    useEffect(() => {
        if (profile) {
            setProfileState({
                name: profile.name ?? "",
                gender: profile.gender ?? "",
                age: String(profile.age ?? ""),
                height: String(profile.height ?? ""),
                weight: String(profile.weight ?? ""),
            });
            setSelectedDiseaseIds(profile.diseases.map((d) => d.sickCode));
            setSelectedMedicationIds(profile.medications.map((m) => m.id));
        }

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
    }, [profile]);

    const mutation = useMutation({
        mutationFn: async () => {
            return updateUserProfile({
                id: user!.id,
                gender: profileState.gender as "남성" | "여성",
                age: Number(profileState.age),
                height: parseFloat(profileState.height),
                weight: parseFloat(profileState.weight),
                diseases: selectedDiseaseIds,
                medications: selectedMedicationIds,
            });
        },
        onSuccess: async () => {
            const updatedUser = await fetchCurrentUser(user!.id);
            const mappedUser = {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                gender: updatedUser.gender,
                age: updatedUser.age,
                height: updatedUser.height,
                weight: updatedUser.weight,
                bmi:
                    updatedUser.height > 0
                        ? updatedUser.weight /
                          Math.pow(updatedUser.height / 100, 2)
                        : 0,
                role: updatedUser.role,
                diseases: updatedUser.diseases.map((d) => ({
                    id: d.sickCode,
                    name: d.name,
                })),
                medications: updatedUser.medications.map((m) => ({
                    id: m.id,
                    name: m.name,
                })),
            };
            setAuth(token!, mappedUser);
            router.push("/(record)/symptomchoice");
        },
        onError: () => {
            Alert.alert("오류", "프로필 저장에 실패했습니다.");
        },
    });

    const handleChange = (key: keyof typeof profileState, value: string) => {
        setProfileState((prev) => ({ ...prev, [key]: value }));
    };

    const getDiseaseNames = () =>
        selectedDiseaseIds
            .map((id) => diseaseList.find((d) => d.sickCode === id)?.name)
            .filter(Boolean)
            .join(", ");

    const getMedicationNames = () =>
        selectedMedicationIds
            .map((id) => medicationList.find((m) => m.id === id)?.name)
            .filter(Boolean)
            .join(", ");

    const diseaseCategories = [...new Set(diseaseList.map((d) => d.category))];

    const calculateBMI = (heightCm: string, weightKg: string) => {
        const height = parseFloat(heightCm) / 100;
        const weight = parseFloat(weightKg);
        if (!height || !weight) return "";
        return (weight / (height * height)).toFixed(1);
    };

    const bmi = calculateBMI(profileState.height, profileState.weight);

    const handleButtonClick = () => {
        if (buttonState === "scroll") {
            scrollViewRef.current?.scrollToEnd({ animated: true });
            setButtonState("next");
        } else {
            mutation.mutate();
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } =
            event.nativeEvent;
        const isScrolledToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 10;
        if (isScrolledToBottom && buttonState === "scroll") {
            setButtonState("next");
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
                {/* 이름 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>이름</Text>
                    </View>
                    <Text style={styles.inputValue}>{profileState.name}</Text>
                </View>

                {/* 성별 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>성별</Text>
                        <TouchableOpacity
                            onPress={() => setEditField("gender")}
                        >
                            <Ionicons
                                name="create-outline"
                                size={16}
                                color="#6B7280"
                            />
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
                                            profileState.gender === item &&
                                                styles.radioCircleSelected,
                                        ]}
                                    />
                                    <Text style={styles.radioLabel}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.inputValue}>
                            {profileState.gender}
                        </Text>
                    )}
                </View>

                {/* 나이 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>나이</Text>
                        <TouchableOpacity onPress={() => setEditField("age")}>
                            <Ionicons
                                name="create-outline"
                                size={16}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>
                    {editField === "age" ? (
                        <TextInput
                            style={styles.inputValue}
                            value={profileState.age}
                            onChangeText={(text) => handleChange("age", text)}
                            onBlur={() => setEditField(null)}
                            autoFocus
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text style={styles.inputValue}>
                            {profileState.age}
                        </Text>
                    )}
                </View>

                {/* 키 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>키(cm)</Text>
                        <TouchableOpacity
                            onPress={() => setEditField("height")}
                        >
                            <Ionicons
                                name="create-outline"
                                size={16}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>
                    {editField === "height" ? (
                        <TextInput
                            style={styles.inputValue}
                            value={profileState.height}
                            onChangeText={(text) =>
                                handleChange("height", text)
                            }
                            onBlur={() => setEditField(null)}
                            autoFocus
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text style={styles.inputValue}>
                            {profileState.height}
                        </Text>
                    )}
                </View>

                {/* 몸무게 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>몸무게(kg)</Text>
                        <TouchableOpacity
                            onPress={() => setEditField("weight")}
                        >
                            <Ionicons
                                name="create-outline"
                                size={16}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>
                    {editField === "weight" ? (
                        <TextInput
                            style={styles.inputValue}
                            value={profileState.weight}
                            onChangeText={(text) =>
                                handleChange("weight", text)
                            }
                            onBlur={() => setEditField(null)}
                            autoFocus
                            keyboardType="numeric"
                        />
                    ) : (
                        <Text style={styles.inputValue}>
                            {profileState.weight}
                        </Text>
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
                        <TouchableOpacity
                            onPress={() => setCategoryModalOpen(true)}
                        >
                            <Ionicons name="add" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.inputValue}>
                        {getDiseaseNames() || "-"}
                    </Text>
                </View>

                {/* 약물 */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>복용 약물</Text>
                        <TouchableOpacity
                            onPress={() => setMedicationModalOpen(true)}
                        >
                            <Ionicons name="add" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.inputValue}>
                        {getMedicationNames() || "-"}
                    </Text>
                </View>
            </ScrollView>

            <Animated.View
                style={[
                    styles.buttonWrapper,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY }],
                        pointerEvents: "auto",
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleButtonClick}
                >
                    <Text style={styles.buttonText}>
                        {buttonState === "scroll" ? "화면 스크롤" : "다음"}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            <DiseaseCategorySelectModal
                visible={categoryModalOpen}
                categories={diseaseCategories}
                diseaseList={diseaseList}
                selected={selectedDiseaseIds}
                onSelectDiseases={(ids) => setSelectedDiseaseIds(ids)}
                onOpenSubcategory={(cat) => {
                    setSelectedCategory(cat);
                    setCategoryModalOpen(false);
                    setListModalOpen(true);
                }}
                onClose={() => setCategoryModalOpen(false)}
            />

            <DiseaseListSelectModal
                visible={listModalOpen}
                category={selectedCategory}
                diseaseList={diseaseList}
                selected={selectedDiseaseIds}
                onToggle={(items) => setSelectedDiseaseIds(items)}
                onSave={() => setListModalOpen(false)}
                onBack={() => {
                    setListModalOpen(false);
                    setCategoryModalOpen(true);
                }}
            />

            <MedicationSelectModal
                visible={medicationModalOpen}
                selected={selectedMedicationIds}
                medicationList={medicationList}
                isLoading={false}
                onClose={() => setMedicationModalOpen(false)}
                onSave={(items) => {
                    setSelectedMedicationIds(items);
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
        color: "#6B7280",
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
