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
import { Disease } from "@/types/disease.types";
import { Medication } from "@/types/medication.types";

export default function ProfileDetailScreen() {
    const { user } = useAuthStore();
    const { data: profile, refetch } = useQuery({
        queryKey: ["user", user?.id],
        queryFn: () => fetchCurrentUser(user!.id),
        enabled: !!user?.id,
    });

    const { data: diseaseList = [], isLoading: isDiseaseLoading } = useQuery({
        queryKey: ["diseases"],
        queryFn: fetchAllDiseases,
    });

    const { data: medicationList = [], isLoading: isMedicationLoading } = useQuery({
        queryKey: ["medications"],
        queryFn: fetchAllMedications,
    });

    const [selectedDiseaseIds, setSelectedDiseaseIds] = useState<string[]>([]);
    const [selectedMedicationIds, setSelectedMedicationIds] = useState<string[]>([]);

    const [editableProfile, setEditableProfile] = useState({
        name: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
    });

    const [diseaseModalOpen, setDiseaseModalOpen] = useState(false);
    const [medicationModalOpen, setMedicationModalOpen] = useState(false);

    useEffect(() => {
        if (profile) {
            setEditableProfile({
                name: profile.name ?? "",
                gender: profile.gender ?? "",
                age: String(profile.age ?? ""),
                height: String(profile.height ?? ""),
                weight: String(profile.weight ?? ""),
            });
            setSelectedDiseaseIds(profile.diseases.map((d: Disease) => d.id));
            setSelectedMedicationIds(profile.medications.map((m: Medication) => m.id));
        }
    }, [profile]);

    const mutation = useMutation({
        mutationFn: async () => {
            return updateUserProfile({
                id: user!.id,
                gender: editableProfile.gender as "남성" | "여성",
                age: Number(editableProfile.age),
                height: parseFloat(editableProfile.height),
                weight: parseFloat(editableProfile.weight),
                diseases: selectedDiseaseIds,
                medications: selectedMedicationIds,
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

    const getNames = (ids: string[], list: { id: string; name: string }[]) =>
        ids.map((id) => list.find((item) => item.id === id)?.name).filter(Boolean).join(", ");

    return (
        <View style={styles.root}>
            <BackButton style={styles.backButton} />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>프로필 정보</Text>

                <View style={styles.card}>
                    <Text style={styles.userName}>{editableProfile.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                <View style={styles.infoBox}>
                    <View style={styles.itemRow}>
                        <Text style={styles.itemLabel}>성별</Text>
                        <View style={styles.radioGroup}>
                            {["남성", "여성"].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => setEditableProfile((prev) => ({ ...prev, gender: item }))}
                                    style={styles.radioItem}
                                >
                                    <View
                                        style={[
                                            styles.radioCircle,
                                            editableProfile.gender === item && styles.radioCircleSelected,
                                        ]}
                                    />
                                    <Text style={styles.radioLabel}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <EditableField label="나이" value={editableProfile.age} onChange={(v) => setEditableProfile((prev) => ({ ...prev, age: v }))} />
                    <EditableField label="키" value={editableProfile.height} onChange={(v) => setEditableProfile((prev) => ({ ...prev, height: v }))} />
                    <EditableField label="몸무게" value={editableProfile.weight} onChange={(v) => setEditableProfile((prev) => ({ ...prev, weight: v }))} />

                    <EditableTextWithButton
                        label="지병"
                        value={getNames(selectedDiseaseIds, diseaseList)}
                        onPress={() => setDiseaseModalOpen(true)}
                    />
                    <EditableTextWithButton
                        label="복용 약물"
                        value={getNames(selectedMedicationIds, medicationList)}
                        onPress={() => setMedicationModalOpen(true)}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={() => mutation.mutate()}>
                    <Text style={styles.saveText}>저장</Text>
                </TouchableOpacity>

                <DiseaseSelectModal
                    visible={diseaseModalOpen}
                    selected={selectedDiseaseIds}
                    diseaseList={diseaseList}
                    isLoading={isDiseaseLoading}
                    onClose={() => setDiseaseModalOpen(false)}
                    onSave={(items) => {
                        setSelectedDiseaseIds(items);
                        setDiseaseModalOpen(false);
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
        </View>
    );
}

function EditableField({ label, value, onChange }: any) {
    return (
        <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>{label}</Text>
            <TextInput
                style={styles.itemInput}
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
            />
        </View>
    );
}

function EditableTextWithButton({ label, value, onPress }: any) {
    return (
        <View style={styles.itemRow}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemLabel}>{label}</Text>
                <TouchableOpacity onPress={onPress}>
                    <Ionicons name="add" size={16} color="#6B7280" />
                </TouchableOpacity>
            </View>
            <Text style={styles.itemValue}>{value}</Text>
        </View>
    );
}


// 스타일 정의
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F3F4F6" },
    backButton: { position: "absolute", top: 20, left: 16, zIndex: 10, padding: 8 },
    container: { paddingTop: 70, paddingHorizontal: 24, paddingBottom: 60 },
    title: { fontSize: 22, fontWeight: "bold", color: "#1E3A8A", marginBottom: 28, textAlign: "center" },
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
    userName: { fontSize: 20, fontWeight: "bold", color: "#111827" },
    userEmail: { fontSize: 14, color: "#6B7280" },
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
    itemLabel: { fontSize: 13, color: "#6B7280" },
    itemValue: { fontSize: 15, fontWeight: "600", color: "#111827" },
    itemInput: { fontSize: 15, fontWeight: "600", color: "#111827", paddingVertical: 2 },
    radioGroup: { flexDirection: "row", gap: 24, marginTop: 4 },
    radioItem: { flexDirection: "row", alignItems: "center" },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: "#9CA3AF",
        marginRight: 8,
    },
    radioCircleSelected: {
        backgroundColor: "#111827",
        borderColor: "#111827",
    },
    radioLabel: { fontSize: 16, color: "#111827" },
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
