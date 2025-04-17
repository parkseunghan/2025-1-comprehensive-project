// 📄 app/(auth)/profile-form.tsx
// 사용자 프로필 입력 + Zod 유효성 검사

import { useState, useEffect } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth.store";
import { updateUserProfile } from "@/services/user.api";
import { fetchAllDiseases } from "@/services/disease.api";
import { fetchAllMedications } from "@/services/medication.api";

import DiseaseSelectModal from "@/modals/disease-select.modal";
import MedicationSelectModal from "@/modals/medication-select.modal";
import BackButton from "@/common/BackButton";

import { z } from "zod";

// ✅ 유효성 검사 스키마
const profileSchema = z.object({
    gender: z.enum(["남성", "여성"]),
    age: z.coerce.number().min(1).max(120),
    height: z.coerce.number().min(50).max(250),
    weight: z.coerce.number().min(10).max(300),
    diseases: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
});

export default function ProfileForm() {
    const { user } = useAuthStore();

    const { data: diseaseList = [], isLoading: isDiseaseLoading } = useQuery({
        queryKey: ["diseases"],
        queryFn: fetchAllDiseases,
    });

    const { data: medicationList = [], isLoading: isMedicationLoading } = useQuery({
        queryKey: ["medications"],
        queryFn: fetchAllMedications,
    });

    const [form, setForm] = useState({
        gender: null as "남성" | "여성" | null,
        age: "",
        height: "",
        weight: "",
    });

    const [diseases, setDiseases] = useState<string[]>([]);
    const [medications, setMedications] = useState<string[]>([]);
    const [diseaseModalOpen, setDiseaseModalOpen] = useState(false);
    const [medicationModalOpen, setMedicationModalOpen] = useState(false);

    const handleSubmit = async () => {
        if (!user?.id) {
            Alert.alert("로그인 후 다시 시도해주세요.");
            return;
        }

        try {
            const parsed: z.infer<typeof profileSchema> = profileSchema.parse({
                ...form,
                diseases,
                medications,
            });

            await updateUserProfile({
                id: user.id,
                ...parsed,
            });

            Alert.alert("✅ 저장 완료", "프로필 정보가 저장되었습니다.");
            router.replace("/(tabs)/home");
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const firstError = err.issues[0]?.message || "입력값이 올바르지 않습니다.";
                Alert.alert("⚠️ 유효성 검사 실패", firstError);
            } else {
                console.error("❌ 프로필 저장 오류:", err);
                Alert.alert("❌ 저장 실패", err?.response?.data?.message || "서버 오류가 발생했습니다.");
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerText}>프로필 입력</Text>
            </View>

            {/* 성별 선택 */}
            <View style={styles.radioGroup}>
                {["남성", "여성"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => setForm({ ...form, gender: item as "남성" | "여성" })}
                        style={styles.radioItem}
                    >
                        <View
                            style={[
                                styles.radioCircle,
                                form.gender === item && styles.radioCircleSelected,
                            ]}
                        />
                        <Text style={styles.radioLabel}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.input}
                placeholder="예: 25"
                keyboardType="numeric"
                value={form.age}
                onChangeText={(v) => setForm({ ...form, age: v })}
            />
            <TextInput
                style={styles.input}
                placeholder="예: 175 (cm)"
                keyboardType="numeric"
                value={form.height}
                onChangeText={(v) => setForm({ ...form, height: v })}
            />
            <TextInput
                style={styles.input}
                placeholder="예: 68 (kg)"
                keyboardType="numeric"
                value={form.weight}
                onChangeText={(v) => setForm({ ...form, weight: v })}
            />

            <View style={styles.inputWithButton}>
                <TextInput
                    style={styles.flexInput}
                    placeholder="선택된 지병 없음"
                    value={diseases.join(", ")}
                    editable={false}
                />
                <TouchableOpacity onPress={() => setDiseaseModalOpen(true)}>
                    <Ionicons name="add" size={20} color="#111827" />
                </TouchableOpacity>
            </View>

            <View style={styles.inputWithButton}>
                <TextInput
                    style={styles.flexInput}
                    placeholder="선택된 약물 없음"
                    value={medications.join(", ")}
                    editable={false}
                />
                <TouchableOpacity onPress={() => setMedicationModalOpen(true)}>
                    <Ionicons name="add" size={20} color="#111827" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>저장하기</Text>
            </TouchableOpacity>

            <DiseaseSelectModal
                visible={diseaseModalOpen}
                selected={diseases}
                diseaseList={diseaseList}
                isLoading={isDiseaseLoading}
                onClose={() => setDiseaseModalOpen(false)}
                onSave={(items) => {
                    setDiseases(items);
                    setDiseaseModalOpen(false);
                }}
            />
            <MedicationSelectModal
                visible={medicationModalOpen}
                selected={medications}
                medicationList={medicationList}
                isLoading={isMedicationLoading}
                onClose={() => setMedicationModalOpen(false)}
                onSave={(items) => {
                    setMedications(items);
                    setMedicationModalOpen(false);
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        paddingHorizontal: 24,
        paddingBottom: 60,
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    radioGroup: {
        flexDirection: "row",
        marginBottom: 24,
        gap: 24,
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
        marginRight: 8,
    },
    radioCircleSelected: {
        backgroundColor: "#111827",
        borderColor: "#111827",
    },
    radioLabel: {
        fontSize: 16,
        color: "#111827",
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        fontSize: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    inputWithButton: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        marginBottom: 24,
    },
    flexInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
    },
    submitButton: {
        backgroundColor: "#D92B4B",
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    submitButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
