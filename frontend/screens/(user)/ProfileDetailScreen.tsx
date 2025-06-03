// ✅ Enhanced ProfileDetailScreen.tsx (고정 헤더 + 카드 애니메이션)
import {
    View,
    Text,
    Platform,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    StatusBar,
    Dimensions,
    Animated,
} from "react-native";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { fetchCurrentUser, updateUserProfile } from "@/services/user.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import BackButton from "@/common/BackButton";
import DiseaseCategorySelectModal from "@/modals/disease-category-select.modal";
import DiseaseListSelectModal from "@/modals/diseaselist-select.modal";
import MedicationSelectModal from "@/modals/medication-select.modal";
import { fetchAllDiseases } from "@/services/disease.api";
import { fetchAllMedications } from "@/services/medication.api";
import { Disease } from "@/types/disease.types";
import { Medication } from "@/types/medication.types";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function ProfileDetailScreen() {
    const { user, token, setAuth } = useAuthStore();

    const { data: profile } = useQuery({
        queryKey: ["user", user?.id],
        queryFn: () => fetchCurrentUser(user!.id),
        enabled: !!user?.id,
    });

    const { data: diseaseList = [] } = useQuery<Disease[]>({
        queryKey: ["diseases"],
        queryFn: fetchAllDiseases,
    });

    const { data: medicationList = [], isLoading: isMedicationLoading } =
        useQuery({
            queryKey: ["medications"],
            queryFn: fetchAllMedications,
        });

    const [selectedDiseaseIds, setSelectedDiseaseIds] = useState<string[]>([]);
    const [selectedMedicationIds, setSelectedMedicationIds] = useState<
        string[]
    >([]);

    const [editableProfile, setEditableProfile] = useState({
        name: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
    });

    const [editField, setEditField] = useState<
        "name" | "age" | "height" | "weight" | null
    >(null);
    const [medicationModalOpen, setMedicationModalOpen] = useState(false);
    const [diseaseCategoryModalOpen, setDiseaseCategoryModalOpen] =
        useState(false);
    const [diseaseListModalOpen, setDiseaseListModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    // 애니메이션을 위한 Animated Values
    const profileCardAnimation = useRef(new Animated.Value(0)).current;
    const basicInfoAnimation = useRef(new Animated.Value(0)).current;
    const medicalInfoAnimation = useRef(new Animated.Value(0)).current;
    const saveButtonAnimation = useRef(new Animated.Value(0)).current;

    const uniqueCategories = useMemo(() => {
        return [...new Set(diseaseList.map((d) => d.category).filter(Boolean))];
    }, [diseaseList]);

    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const successAnim = useRef(new Animated.Value(0)).current;

    const showSuccess = () => {
        setShowSuccessBanner(true);
        Animated.timing(successAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.timing(successAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setShowSuccessBanner(false);
                router.replace("/(tabs)/home");
            });
        }, 2500);
    };

    useEffect(() => {
        if (profile) {
            setEditableProfile({
                name: profile.name ?? "",
                gender: profile.gender ?? "",
                age: String(profile.age ?? ""),
                height: String(profile.height ?? ""),
                weight: String(profile.weight ?? ""),
            });
            setSelectedDiseaseIds(profile.diseases.map((d) => d.sickCode));
            setSelectedMedicationIds(profile.medications.map((m) => m.id));
        }
    }, [profile]);

    // 컴포넌트 마운트 시 애니메이션 실행
    useEffect(() => {
        const animations = [
            { anim: profileCardAnimation, delay: 100 },
            { anim: basicInfoAnimation, delay: 200 },
            { anim: medicalInfoAnimation, delay: 300 },
            { anim: saveButtonAnimation, delay: 400 },
        ];

        const animationPromises = animations.map(
            ({ anim, delay }) =>
                new Promise<void>((resolve) => {
                    setTimeout(() => {
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 600,
                            useNativeDriver: true,
                        }).start(() => resolve());
                    }, delay);
                })
        );

        Promise.all(animationPromises);
    }, []);

    const mutation = useMutation({
        mutationFn: async () => {
            return updateUserProfile({
                id: user!.id,
                name: editableProfile.name,
                gender: editableProfile.gender as "남성" | "여성",
                age: Number(editableProfile.age),
                height: parseFloat(editableProfile.height),
                weight: parseFloat(editableProfile.weight),
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
            showSuccess(); // ✅ 배너 표시 함수 호출
        },
    });

    const getMedicationNames = (ids: string[], list: Medication[]) =>
        ids
            .map((id) => list.find((m) => m.id === id)?.name)
            .filter(Boolean)
            .join(", ");

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" />

            {/* 고정 상단 그라데이션 헤더 */}
            <View style={styles.fixedHeader}>
                <LinearGradient
                    colors={["#D92B4B", "#FF6B8A"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <BackButton style={styles.backButton} />
                    <Text style={styles.title}>프로필 정보</Text>
                </LinearGradient>
            </View>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {/* 프로필 카드 - 애니메이션 적용 */}
                <Animated.View
                    style={[
                        styles.profileCardContainer,
                        {
                            opacity: profileCardAnimation,
                            transform: [
                                {
                                    translateY:
                                        profileCardAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.card}>
                        <LinearGradient
                            colors={["#D92B4B", "#FF6B8A"]}
                            style={styles.avatar}
                        >
                            <Feather name="user" size={32} color="#ffffff" />
                        </LinearGradient>

                        <EditableNameField
                            value={editableProfile.name}
                            editing={editField === "name"}
                            onPressEdit={() => setEditField("name")}
                            onChange={(v: string) =>
                                setEditableProfile((prev) => ({
                                    ...prev,
                                    name: v,
                                }))
                            }
                            onBlur={() => setEditField(null)}
                        />
                        <Text style={styles.userEmail}>{user?.email}</Text>
                    </View>
                </Animated.View>

                {/* 정보 입력 폼 */}
                <View style={styles.formContainer}>
                    {/* 기본 정보 - 애니메이션 적용 */}
                    <Animated.View
                        style={[
                            styles.infoBox,
                            {
                                opacity: basicInfoAnimation,
                                transform: [
                                    {
                                        translateY:
                                            basicInfoAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [50, 0],
                                            }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <FontAwesome5
                                name="user-edit"
                                size={16}
                                color="#D92B4B"
                            />
                            <Text style={styles.sectionTitle}>기본 정보</Text>
                        </View>

                        <View style={styles.itemRow}>
                            <Text style={styles.itemLabel}>성별</Text>
                            <View style={styles.radioGroup}>
                                {["남성", "여성"].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() =>
                                            setEditableProfile((prev) => ({
                                                ...prev,
                                                gender: item,
                                            }))
                                        }
                                        style={styles.radioItem}
                                    >
                                        <View
                                            style={[
                                                styles.radioCircle,
                                                editableProfile.gender ===
                                                    item &&
                                                    styles.radioCircleSelected,
                                            ]}
                                        />
                                        <Text style={styles.radioLabel}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <EditableField
                            label="(만)나이"
                            value={editableProfile.age}
                            editing={editField === "age"}
                            onPressEdit={() => setEditField("age")}
                            onChange={(v: string) =>
                                setEditableProfile((prev) => ({
                                    ...prev,
                                    age: v,
                                }))
                            }
                            onBlur={() => setEditField(null)}
                            icon="calendar"
                            unit="세"
                        />
                        <EditableField
                            label="키"
                            value={editableProfile.height}
                            editing={editField === "height"}
                            onPressEdit={() => setEditField("height")}
                            onChange={(v: string) =>
                                setEditableProfile((prev) => ({
                                    ...prev,
                                    height: v,
                                }))
                            }
                            onBlur={() => setEditField(null)}
                            icon="trending-up"
                            unit="cm"
                        />
                        <EditableField
                            label="몸무게"
                            value={editableProfile.weight}
                            editing={editField === "weight"}
                            onPressEdit={() => setEditField("weight")}
                            onChange={(v: string) =>
                                setEditableProfile((prev) => ({
                                    ...prev,
                                    weight: v,
                                }))
                            }
                            onBlur={() => setEditField(null)}
                            icon="activity"
                            unit="kg"
                        />
                    </Animated.View>

                    {/* 의료 정보 섹션 - 애니메이션 적용 */}
                    <Animated.View
                        style={[
                            styles.infoBox,
                            {
                                opacity: medicalInfoAnimation,
                                transform: [
                                    {
                                        translateY:
                                            medicalInfoAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [50, 0],
                                            }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <FontAwesome5
                                name="file-medical"
                                size={16}
                                color="#D92B4B"
                            />
                            <Text style={styles.sectionTitle}>의료 정보</Text>
                        </View>

                        <EditableTextWithButton
                            label="지병"
                            value=""
                            onPress={() => setDiseaseCategoryModalOpen(true)}
                            icon="plus"
                            color="#D92B4B"
                        />
                        {selectedDiseaseIds.length > 0 && (
                            <View style={styles.tagContainer}>
                                {selectedDiseaseIds.map((id) => {
                                    const disease = diseaseList.find(
                                        (d) => d.sickCode === id
                                    );
                                    return (
                                        <TouchableOpacity
                                            key={id}
                                            onPress={() =>
                                                setSelectedDiseaseIds((prev) =>
                                                    prev.filter((v) => v !== id)
                                                )
                                            }
                                            style={[
                                                styles.tag,
                                                { borderColor: "#D92B4B30" },
                                            ]}
                                        >
                                            <Text style={styles.tagText}>
                                                {disease?.name} ✕
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                        <EditableTextWithButton
                            label="복용 약물"
                            value=""
                            onPress={() => setMedicationModalOpen(true)}
                            icon="plus"
                            color="#4A90E2"
                        />
                        {selectedMedicationIds.length > 0 && (
                            <View style={styles.tagContainer}>
                                {selectedMedicationIds.map((id) => {
                                    const med = medicationList.find(
                                        (m) => m.id === id
                                    );
                                    const displayName = med?.name
                                        .replace(/\(수출명\s*:\s*.*?\)/g, "")
                                        .trim();

                                    return (
                                        <TouchableOpacity
                                            key={id}
                                            onPress={() =>
                                                setSelectedMedicationIds(
                                                    (prev) =>
                                                        prev.filter(
                                                            (v) => v !== id
                                                        )
                                                )
                                            }
                                            style={[
                                                styles.tag,
                                                { borderColor: "#4A90E230" },
                                            ]}
                                        >
                                            <Text
                                                style={styles.tagText}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {displayName} ✕
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </Animated.View>
                </View>

                {/* 저장 버튼 - 애니메이션 적용 */}
                <Animated.View
                    style={[
                        styles.saveButtonWrapper,
                        {
                            opacity: saveButtonAnimation,
                            transform: [
                                {
                                    translateY: saveButtonAnimation.interpolate(
                                        {
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }
                                    ),
                                },
                            ],
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => mutation.mutate()}
                        disabled={mutation.isPending}
                    >
                        <LinearGradient
                            colors={["#D92B4B", "#FF6B8A"]}
                            style={styles.saveButtonGradient}
                        >
                            {mutation.isPending ? (
                                <Text style={styles.saveText}>저장 중...</Text>
                            ) : (
                                <>
                                    <Feather
                                        name="check"
                                        size={18}
                                        color="#ffffff"
                                    />
                                    <Text style={styles.saveText}>
                                        저장하기
                                    </Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* 모달들 */}
                <DiseaseCategorySelectModal
                    visible={diseaseCategoryModalOpen}
                    categories={uniqueCategories}
                    diseaseList={diseaseList}
                    selected={selectedDiseaseIds}
                    onSelectDiseases={(ids) => setSelectedDiseaseIds(ids)}
                    onOpenSubcategory={(cat) => {
                        setSelectedCategory(cat);
                        setDiseaseCategoryModalOpen(false);
                        setDiseaseListModalOpen(true);
                    }}
                    onClose={() => setDiseaseCategoryModalOpen(false)}
                />

                <DiseaseListSelectModal
                    visible={diseaseListModalOpen}
                    category={selectedCategory}
                    diseaseList={diseaseList}
                    selected={selectedDiseaseIds}
                    onToggle={(ids) => setSelectedDiseaseIds(ids)}
                    onSave={() => setDiseaseListModalOpen(false)}
                    onBack={() => {
                        setDiseaseListModalOpen(false);
                        setDiseaseCategoryModalOpen(true);
                    }}
                />

                <MedicationSelectModal
                    visible={medicationModalOpen}
                    selected={selectedMedicationIds}
                    medicationList={medicationList}
                    isLoading={isMedicationLoading}
                    onClose={() => setMedicationModalOpen(false)}
                    onSave={(items) => {
                        setSelectedMedicationIds(items);
                        setMedicationModalOpen(false);
                    }}
                />
            </ScrollView>
            {showSuccessBanner && (
                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            top: 100,
                            left: 20,
                            right: 20,
                            backgroundColor: "#22C55E",
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            zIndex: 2000,
                            elevation: 10,
                            opacity: successAnim,
                            transform: [
                                {
                                    translateY: successAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-40, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Feather
                        name="check-circle"
                        size={18}
                        color="#fff"
                        style={{ marginRight: 8 }}
                    />
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: "500",
                        }}
                    >
                        저장 완료! 프로필이 업데이트되었습니다.
                    </Text>
                </Animated.View>
            )}
        </View>
    );
}

function EditableNameField({
    value,
    editing,
    onPressEdit,
    onChange,
    onBlur,
}: any) {
    return (
        <View style={styles.nameContainer}>
            {editing ? (
                <TextInput
                    style={styles.userName}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="default"
                    autoFocus
                    onBlur={onBlur}
                    placeholderTextColor="#9CA3AF"
                />
            ) : (
                <TouchableOpacity onPress={onPressEdit} style={styles.nameRow}>
                    <Text style={styles.userName}>
                        {value || "이름을 입력하세요"}
                    </Text>
                    <View style={styles.editIconContainer}>
                        <Feather name="edit-2" size={14} color="#D92B4B" />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

function EditableField({
    label,
    value,
    editing,
    onPressEdit,
    onChange,
    onBlur,
    icon,
    unit,
}: any) {
    return (
        <View style={styles.itemRow}>
            <View style={styles.itemHeader}>
                <View style={styles.labelContainer}>
                    <View style={styles.fieldIcon}>
                        <Feather name={icon} size={14} color="#6B7280" />
                    </View>
                    <Text style={styles.itemLabel}>{label}</Text>
                </View>

                <TouchableOpacity
                    onPress={onPressEdit}
                    style={styles.editButton}
                >
                    <Feather name="edit-2" size={12} color="#D92B4B" />
                </TouchableOpacity>
            </View>

            {editing ? (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.itemInput}
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        autoFocus
                        onBlur={onBlur}
                        placeholder="입력하세요"
                        placeholderTextColor="#9CA3AF"
                    />
                    {unit && <Text style={styles.unitText}>{unit}</Text>}
                </View>
            ) : (
                <TouchableOpacity
                    onPress={onPressEdit}
                    style={styles.valueContainer}
                >
                    <Text style={styles.itemValue}>
                        {value || "입력되지 않음"}
                        {value && unit && ` ${unit}`}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

function EditableTextWithButton({ label, value, onPress, icon, color }: any) {
    const getIconName = () => {
        if (label === "지병") return "heartbeat";
        if (label === "복용 약물") return "pills";
        return "notes-medical";
    };

    const getIconColor = () => {
        if (label === "지병") return "#D92B4B"; // 빨강
        if (label === "복용 약물") return "#4A90E2"; // 파랑
        return;
    };

    return (
        <View style={styles.itemRow}>
            <View style={styles.itemHeader}>
                <View style={styles.labelContainer}>
                    <View style={styles.fieldIcon}>
                        <FontAwesome5
                            name={getIconName()}
                            size={14}
                            color={getIconColor()}
                        />
                    </View>
                    <Text style={styles.itemLabel}>{label}</Text>
                </View>

                <TouchableOpacity
                    onPress={onPress}
                    style={[styles.addButton, { borderColor: color + "40" }]}
                >
                    <Feather name={icon} size={14} color={color} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F8F9FC",
    },

    // 고정 헤더 스타일
    fixedHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    headerGradient: {
        paddingTop: 25,
        paddingBottom: 25,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
    },

    scrollView: {
        flex: 1,
        paddingTop: 90,
    },
    container: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    // 프로필 카드 스타일
    profileCardContainer: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: "center",
        borderWidth: 0.4,
        borderColor: "#FF6B8A",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    nameContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 8,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    userName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        textAlign: "center",
    },
    editIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#FFE8ED",
        justifyContent: "center",
        alignItems: "center",
    },
    userEmail: {
        fontSize: 14,
        color: "#6B7280",
        opacity: 0.8,
    },

    // 폼 컨테이너
    formContainer: {
        gap: 20,
        marginBottom: 30,
    },

    // 정보 박스 스타일
    infoBox: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },

    itemRow: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    fieldIcon: {
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    itemLabel: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "500",
    },
    editButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#FFE8ED",
        justifyContent: "center",
        alignItems: "center",
    },
    addButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    itemValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    valueContainer: {
        paddingVertical: 4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    itemInput: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#F9FAFB",
        borderRadius: 8,
        flex: 1,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    unitText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },

    // 라디오 버튼 스타일
    radioGroup: {
        flexDirection: "row",
        gap: 32,
        marginTop: 8,
    },
    radioItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    radioCircleSelected: {
        borderColor: "#D92B4B",
        backgroundColor: "#D92B4B",
    },
    radioLabel: {
        fontSize: 16,
        color: "#111827",
        fontWeight: "500",
    },

    // 태그 스타일
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12,
    },
    tag: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#FAFAFA",
    },
    tagText: {
        fontSize: 12,
        color: "#4B5563",
        fontWeight: "500",
    },

    // 저장 버튼 스타일
    saveButtonWrapper: {
        marginTop: 20,
        marginBottom: 20,
    },
    saveButton: {
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#D92B4B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
    },
    saveText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
