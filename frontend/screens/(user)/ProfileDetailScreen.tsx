// 📄 screens/(user)/ProfileDetailScreen.tsx

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { fetchCurrentUser, updateUserProfile } from "@/services/user.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import BackButton from "@/common/BackButton";
import DiseaseSelectModal from "@/modals/disease-select.modal";
import MedicationSelectModal from "@/modals/medication-select.modal";
import { fetchAllDiseases } from "@/services/disease.api";
import { fetchAllMedications } from "@/services/medication.api";

export default function ProfileDetailScreen() {
    const { user } = useAuthStore();
    const [editField, setEditField] = useState<string | null>(null);

    const { data: profile, refetch } = useQuery({
        queryKey: ["user", user?.id],
        queryFn: () => fetchCurrentUser(user!.id),
        enabled: !!user?.id,
    });

    const [editableProfile, setEditableProfile] = useState({
        name: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
        diseases: "",
        medications: "",
    });

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

    useEffect(() => {
        if (profile) {
            setEditableProfile({
                name: profile.name ?? "",
                gender: profile.gender ?? "",
                age: String(profile.age ?? ""),
                height: String(profile.height ?? ""),
                weight: String(profile.weight ?? ""),
                diseases: profile.diseases?.map((d: any) => d.name).join(", ") ?? "",
                medications: profile.medications?.map((m: any) => m.name).join(", ") ?? "",
            });
        }
    }, [profile]);

    const mutation = useMutation({
        mutationFn: async () => {
            return updateUserProfile({
                id: user!.id,
                gender:
                    editableProfile.gender === "남성"
                        ? "남성"
                        : editableProfile.gender === "여성"
                            ? "여성"
                            : "남성",
                age: Number(editableProfile.age),
                height: parseFloat(editableProfile.height),
                weight: parseFloat(editableProfile.weight),
                diseases: editableProfile.diseases
                    .split(",")
                    .map((d) => d.trim())
                    .filter(Boolean),
                medications: editableProfile.medications
                    .split(",")
                    .map((m) => m.trim())
                    .filter(Boolean),
            });
        },
        onSuccess: () => {
            Alert.alert("저장 완료", "프로필 정보가 저장되었습니다.");
            refetch();
            router.replace("/(tabs)/home");
        },
        onError: () => {
            Alert.alert("오류", "프로필 저장에 실패했습니다.");
        },
    });

    const handleChange = (key: keyof typeof editableProfile, value: string) => {
        setEditableProfile((prev) => ({ ...prev, [key]: value }));
    };

    const handleEdit = (key: keyof typeof editableProfile) => {
        if (key === "diseases") {
            setDiseaseModalOpen(true);
        } else if (key === "medications") {
            setMedicationModalOpen(true);
        } else {
            setEditField(key);
        }
    };

    const editableItems: {
        key: keyof typeof editableProfile;
        label: string;
        icon?: keyof typeof Ionicons.glyphMap;
    }[] = [
        { key: "gender", label: "성별" },
        { key: "age", label: "나이" },
        { key: "height", label: "키" },
        { key: "weight", label: "몸무게" },
        { key: "diseases", label: "지병", icon: "add" },
        { key: "medications", label: "복용 약물", icon: "add" },
    ];

    return (
        <View style={styles.root}>
            <BackButton style={styles.backButton} />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>프로필 정보</Text>

                <View style={styles.card}>
                    <View style={styles.rowWithEdit}>
                        {editField === "name" ? (
                            <TextInput
                                style={styles.userName}
                                value={editableProfile.name}
                                onChangeText={(v) => handleChange("name", v)}
                                onBlur={() => setEditField(null)}
                                autoFocus
                            />
                        ) : (
                            <Text style={styles.userName}>{editableProfile.name}</Text>
                        )}
                        <TouchableOpacity onPress={() => setEditField("name")}>
                            <Ionicons name="create-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                <View style={styles.infoBox}>
                    {editableItems.map((item) => (
                        <EditableText
                            key={item.key}
                            label={item.label}
                            value={editableProfile[item.key]}
                            editable={editField === item.key}
                            onEdit={() => handleEdit(item.key)}
                            onChange={(v) => handleChange(item.key, v)}
                            onBlur={() => setEditField(null)}
                            iconName={item.icon ?? "create-outline"}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={() => mutation.mutate()}>
                    <Text style={styles.saveText}>저장</Text>
                </TouchableOpacity>

                {/* 🔻 모달 영역 */}
                <DiseaseSelectModal
                    visible={diseaseModalOpen}
                    selected={editableProfile.diseases.split(",").map((d) => d.trim())}
                    diseaseList={diseaseList}
                    isLoading={isDiseaseLoading}
                    onClose={() => setDiseaseModalOpen(false)}
                    onSave={(items) => {
                        setEditableProfile((prev) => ({
                            ...prev,
                            diseases: items.join(", "),
                        }));
                        setDiseaseModalOpen(false);
                    }}
                />
                <MedicationSelectModal
                    visible={medicationModalOpen}
                    selected={editableProfile.medications.split(",").map((m) => m.trim())}
                    medicationList={medicationList}
                    isLoading={isMedicationLoading}
                    onClose={() => setMedicationModalOpen(false)}
                    onSave={(items) => {
                        setEditableProfile((prev) => ({
                            ...prev,
                            medications: items.join(", "),
                        }));
                        setMedicationModalOpen(false);
                    }}
                />
            </ScrollView>
        </View>
    );
}

function EditableText({
    label,
    value,
    editable,
    onEdit,
    onChange,
    onBlur,
    iconName = "create-outline",
}: {
    label: string;
    value: string;
    editable: boolean;
    onEdit: () => void;
    onChange: (text: string) => void;
    onBlur: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
}) {
    return (
        <View style={styles.itemRow}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemLabel}>{label}</Text>
                <TouchableOpacity onPress={onEdit}>
                    <Ionicons name={iconName} size={16} color="#6B7280" />
                </TouchableOpacity>
            </View>
            {editable ? (
                <TextInput
                    style={styles.itemInput}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoFocus
                />
            ) : (
                <Text style={styles.itemValue}>{value}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F3F4F6" },
    backButton: {
        position: "absolute",
        top: 20,
        left: 16,
        zIndex: 10,
        padding: 8,
    },
    container: {
        paddingTop: 70,
        paddingHorizontal: 24,
        paddingBottom: 60,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginBottom: 28,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 20,
        marginBottom: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    rowWithEdit: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 6,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    userEmail: {
        fontSize: 14,
        color: "#6B7280",
    },
    infoBox: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    itemRow: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    itemLabel: {
        fontSize: 13,
        color: "#6B7280",
    },
    itemValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    itemInput: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
        paddingVertical: 2,
    },
    saveButton: {
        backgroundColor: "#D92B4B",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
    },
    saveText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
