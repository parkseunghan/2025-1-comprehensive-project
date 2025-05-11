// ✅ ProfileDetailScreen.tsx
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
import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { fetchCurrentUser, updateUserProfile } from "@/services/user.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import BackButton from "@/common/BackButton";
import DiseaseCategorySelectModal from "@/modals/disease_category-select.modal";
import DiseaseListSelectModal from "@/modals/diseaselist-select.modal";
import MedicationSelectModal from "@/modals/medication-select.modal";
import { fetchAllDiseases } from "@/services/disease.api";
import { fetchAllMedications } from "@/services/medication.api";
import { Disease } from "@/types/disease.types";
import { Medication } from "@/types/medication.types";

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

    const [editField, setEditField] = useState<"name" | "age" | "height" | "weight" | null>(null);
    const [medicationModalOpen, setMedicationModalOpen] = useState(false);
    const [diseaseCategoryModalOpen, setDiseaseCategoryModalOpen] = useState(false);
    const [diseaseListModalOpen, setDiseaseListModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const uniqueCategories = useMemo(() => {
        return [...new Set(diseaseList.map((d) => d.category).filter(Boolean))];
    }, [diseaseList]);

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
                bmi: updatedUser.height > 0 ? (updatedUser.weight / Math.pow(updatedUser.height / 100, 2)) : 0,
                role: updatedUser.role,
                diseases: updatedUser.diseases.map((d) => ({ id: d.sickCode, name: d.name })),
                medications: updatedUser.medications.map((m) => ({ id: m.id, name: m.name })),
            };
            setAuth(token!, mappedUser);
            Alert.alert("저장 완료", "프로필 정보가 저장되었습니다.");
            router.replace("/(tabs)/home");
        },
        onError: () => {
            Alert.alert("오류", "프로필 저장에 실패했습니다.");
        },
    });

    const getMedicationNames = (ids: string[], list: Medication[]) =>
        ids.map((id) => list.find((m) => m.id === id)?.name).filter(Boolean).join(", ");

    return (
        <View style={styles.root}>
            <BackButton style={styles.backButton} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>프로필 정보</Text>
                <View style={styles.card}>
                    <EditableNameField
                        value={editableProfile.name}
                        editing={editField === "name"}
                        onPressEdit={() => setEditField("name")}
                        onChange={(v: string) => setEditableProfile((prev) => ({ ...prev, name: v }))}
                        onBlur={() => setEditField(null)}
                    />
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
                <View style={styles.infoBox}>
                    <View style={styles.itemRow}>
                        <Text style={styles.itemLabel}>성별</Text>
                        <View style={styles.radioGroup}>
                            {["남성", "여성"].map((item) => (
                                <TouchableOpacity key={item} onPress={() => setEditableProfile((prev) => ({ ...prev, gender: item }))} style={styles.radioItem}>
                                    <View style={[styles.radioCircle, editableProfile.gender === item && styles.radioCircleSelected]} />
                                    <Text style={styles.radioLabel}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <EditableField label="나이" value={editableProfile.age} editing={editField === "age"} onPressEdit={() => setEditField("age")} onChange={(v: string) => setEditableProfile((prev) => ({ ...prev, age: v }))} onBlur={() => setEditField(null)} />
                    <EditableField label="키" value={editableProfile.height} editing={editField === "height"} onPressEdit={() => setEditField("height")} onChange={(v: string) => setEditableProfile((prev) => ({ ...prev, height: v }))} onBlur={() => setEditField(null)} />
                    <EditableField label="몸무게" value={editableProfile.weight} editing={editField === "weight"} onPressEdit={() => setEditField("weight")} onChange={(v: string) => setEditableProfile((prev) => ({ ...prev, weight: v }))} onBlur={() => setEditField(null)} />

                    <EditableTextWithButton label="지병" value="" onPress={() => setDiseaseCategoryModalOpen(true)} />
                    {selectedDiseaseIds.length > 0 && (
                        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                            {selectedDiseaseIds.map((id) => {
                                const disease = diseaseList.find((d) => d.sickCode === id);
                                return (
                                    <TouchableOpacity
                                        key={id}
                                        onPress={() => setSelectedDiseaseIds((prev) => prev.filter((v) => v !== id))}
                                        style={{
                                            backgroundColor: "#f3f4f6",
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            borderRadius: 16,
                                            margin: 4,
                                        }}
                                    >
                                        <Text style={{ color: "#111827" }}>{disease?.name} ✕</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    <EditableTextWithButton label="복용 약물" value="" onPress={() => setMedicationModalOpen(true)} />
                    {selectedMedicationIds.length > 0 && (
                        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                            {selectedMedicationIds.map((id) => {
                                const med = medicationList.find((m) => m.id === id);
                                return (
                                    <TouchableOpacity
                                        key={id}
                                        onPress={() => setSelectedMedicationIds((prev) => prev.filter((v) => v !== id))}
                                        style={{
                                            backgroundColor: "#f3f4f6",
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            borderRadius: 16,
                                            margin: 4,
                                        }}
                                    >
                                        <Text style={{ color: "#111827" }}>{med?.name} ✕</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
                <View style={styles.saveButtonWrapper}>
                    <TouchableOpacity style={styles.saveButton} onPress={() => mutation.mutate()}>
                        <Text style={styles.saveText}>저장</Text>
                    </TouchableOpacity>
                </View>

                <DiseaseCategorySelectModal visible={diseaseCategoryModalOpen} categories={uniqueCategories} onSelect={(cat) => { setSelectedCategory(cat); setDiseaseCategoryModalOpen(false); setDiseaseListModalOpen(true); }} onClose={() => setDiseaseCategoryModalOpen(false)} />

                <DiseaseListSelectModal visible={diseaseListModalOpen} category={selectedCategory} diseaseList={diseaseList} selected={selectedDiseaseIds} onToggle={(id) => setSelectedDiseaseIds((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])} onSave={() => setDiseaseListModalOpen(false)} onClose={() => setDiseaseListModalOpen(false)} />

                <MedicationSelectModal visible={medicationModalOpen} selected={selectedMedicationIds} medicationList={medicationList} isLoading={isMedicationLoading} onClose={() => setMedicationModalOpen(false)} onSave={(items) => { setSelectedMedicationIds(items); setMedicationModalOpen(false); }} />
            </ScrollView>
        </View>
    );
}


function EditableNameField({ value, editing, onPressEdit, onChange, onBlur }: any) {
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
                />
            ) : (
                <View style={styles.nameRow}>
                    <Text style={styles.userName}>{value}</Text>
                    <TouchableOpacity onPress={onPressEdit} style={{ marginLeft: 6 }}>
                        <Ionicons name="create-outline" size={16} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

function EditableField({ label, value, editing, onPressEdit, onChange, onBlur }: any) {
    return (
        <View style={styles.itemRow}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemLabel}>{label}</Text>
                <TouchableOpacity onPress={onPressEdit}>
                    <Ionicons name="create-outline" size={16} color="#6B7280" />
                </TouchableOpacity>
            </View>
            {editing ? (
                <TextInput
                    style={styles.itemInput}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    autoFocus
                    onBlur={onBlur}
                />
            ) : (
                <Text style={styles.itemValue}>{value}</Text>
            )}
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

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F4F1FF" },
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
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    nameContainer: { width: "100%", alignItems: "center", marginBottom: 4 },
    nameRow: { flexDirection: "row", alignItems: "center" },
    userName: { fontSize: 20, fontWeight: "bold", color: "#111827" },
    userEmail: { fontSize: 14, color: "#6B7280" },
    infoBox: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
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
    saveButtonWrapper: {
        backgroundColor: "#F4F1FF",
        paddingHorizontal: 20,
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
