// 📄 app/(auth)/profile-form.tsx

// 🔹 사용자 프로필 입력 페이지
// 사용자가 성별, 나이, 키, 몸무게, 지병, 복용약을 입력하고 저장하는 화면입니다.
// 저장된 정보는 이후 질병 예측에 활용됩니다.

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router"; // 🔸 페이지 간 이동을 도와주는 함수
import { Ionicons } from "@expo/vector-icons"; // 🔸 아이콘 사용 라이브러리
import { useQuery } from "@tanstack/react-query"; // 🔸 서버 데이터(fetch)를 캐싱하고 상태 관리하는 라이브러리

import { useAuthStore } from "@/store/auth.store"; // 🔸 현재 로그인된 사용자 정보를 가져오는 상태관리 훅
import { updateUserProfile } from "@/services/user.api"; // 🔸 사용자 정보를 서버에 저장하는 API
import { fetchAllDiseases } from "@/services/disease.api"; // 🔸 전체 지병 목록을 서버에서 가져오는 API
import { fetchAllMedications } from "@/services/medication.api"; // 🔸 전체 약물 목록을 서버에서 가져오는 API

// 🔸 지병/약물 선택 모달 컴포넌트
import DiseaseSelectModal from "@/components/modals/disease-select.modal";
import MedicationSelectModal from "@/components/modals/medication-select.modal";

export default function ProfileForm() {
  const { user } = useAuthStore(); // ✅ 현재 로그인된 사용자 정보 가져오기 (id 필요)

  // ✅ 지병 리스트 fetch (DB에서 한 번만 가져와서 캐시)
  const { data: diseaseList = [], isLoading: isDiseaseLoading } = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchAllDiseases,
  });

  // ✅ 약물 리스트 fetch (DB에서 한 번만 가져와서 캐시)
  const { data: medicationList = [], isLoading: isMedicationLoading } = useQuery({
    queryKey: ["medications"],
    queryFn: fetchAllMedications,
  });

  // ✅ 입력값을 하나의 form 객체에 저장 (age, height 등)
  const [form, setForm] = useState({
    gender: null as "남성" | "여성" | null,
    age: "",
    height: "",
    weight: "",
  });

  // ✅ 지병/약물 선택 상태 관리
  const [diseases, setDiseases] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);

  // ✅ 모달 열림 여부
  const [diseaseModalOpen, setDiseaseModalOpen] = useState(false);
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);

  // ✅ 프로필 저장 버튼 눌렀을 때 실행되는 함수
  const handleSubmit = async () => {
    // 사용자 로그인 확인
    if (!user?.id) {
      Alert.alert("로그인 후 다시 시도해주세요.");
      return;
    }

    const { gender, age, height, weight } = form;
    if (!gender || !age || !height || !weight) {
      Alert.alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      // 서버에 프로필 정보 저장
      await updateUserProfile({
        id: user.id,
        gender: gender === "남성" ? "male" : "female",
        age: Number(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
        diseases,
        medications,
      });

      Alert.alert("저장이 완료되었습니다.");
      router.replace("/(tabs)/home"); // 🔸 홈 탭 화면으로 이동
    } catch (err: any) {
      console.error("❌ 프로필 저장 오류:", err);
      Alert.alert("프로필 저장 중 오류가 발생했습니다.", err?.message ?? "");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
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

      {/* 나이/키/몸무게 입력 */}
      <TextInput
        style={styles.input}
        placeholder="나이"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={form.age}
        onChangeText={(v) => setForm({ ...form, age: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="키 (cm)"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={form.height}
        onChangeText={(v) => setForm({ ...form, height: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="몸무게 (kg)"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={form.weight}
        onChangeText={(v) => setForm({ ...form, weight: v })}
      />

      {/* 지병 선택 */}
      <View style={styles.inputWithButton}>
        <TextInput
          style={styles.flexInput}
          placeholder="지병"
          placeholderTextColor="#9CA3AF"
          value={diseases.join(", ")}
          editable={false}
        />
        <TouchableOpacity onPress={() => setDiseaseModalOpen(true)}>
          <Ionicons name="add" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* 복용 약물 선택 */}
      <View style={styles.inputWithButton}>
        <TextInput
          style={styles.flexInput}
          placeholder="복용 중인 약물"
          placeholderTextColor="#9CA3AF"
          value={medications.join(", ")}
          editable={false}
        />
        <TouchableOpacity onPress={() => setMedicationModalOpen(true)}>
          <Ionicons name="add" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>저장하기</Text>
      </TouchableOpacity>

      {/* 모달: 리스트 로딩은 모달 내부에서 처리 */}
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

// 🔸 스타일 정의 (Tailwind 스타일을 코드로 직접 작성)
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
  backButton: {
    marginRight: 8,
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
