// ✅ CategorySelectScreen.tsx
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchAllSymptoms } from "@/services/symptom.api";
import { Symptom } from "@/types/symptom.types";
import { useSymptomStore } from "@/store/symptom.store";
import { useAuthStore } from "@/store/auth.store";
import { createSymptomRecord } from "@/services/record.api";
import { requestPrediction, requestPredictionToDB } from "@/services/prediction.api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CategorySelectScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const { selected, toggle } = useSymptomStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = async () => {
    if (selected.length === 0) {
      Alert.alert("⚠️ 최소 한 가지 증상을 선택해 주세요.");
      return;
    }
    try {
      setIsLoading(true);
      const record = await createSymptomRecord({ userId: user!.id, symptoms: selected });
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
      const predictionRanks = aiPrediction.predictions.map((pred, i) => ({
        rank: i + 1,
        coarseLabel: pred.coarseLabel,
        fineLabel: pred.fineLabel,
        riskScore: pred.riskScore,
      }));
      await requestPredictionToDB({ recordId: record.id, predictions: predictionRanks });
      router.push("/(record)/result");
    } catch (err) {
      console.error("❌ 예측 실패:", err);
      Alert.alert("예측 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const symptoms = await fetchAllSymptoms();
        const categorySet = new Set(symptoms.map((s) => s.category));
        setCategories(Array.from(categorySet));
      } catch (err) {
        console.error("❌ symptom fetch error:", err);
      }
    };
    fetch();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 뒤로가기 + 예측하기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(record)/symptomchoice")}> 
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handlePrediction} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#D92B4B" />
          ) : (
            <Text style={styles.predictText}>예측하기</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>대분류를 선택하세요</Text>

      {selected.length > 0 && (
        <View style={styles.selectedBox}>
          {selected.map((name) => (
            <TouchableOpacity key={name} style={styles.chip} onPress={() => toggle(name)}>
              <Text style={styles.chipText}>{name} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.item}
          onPress={() => router.push(`/(record)/symptomselectscreen?category=${encodeURIComponent(category)}`)}
        >
          <Text style={styles.itemText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { fontSize: 20, fontWeight: "600", color: "#2563eb" },
  predictText: { fontSize: 16, fontWeight: "600", color: "#D92B4B" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  selectedBox: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  chip: { backgroundColor: "#f3f4f6", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, margin: 4 },
  chipText: { color: "#111827" },
  item: { padding: 14, borderWidth: 1, borderRadius: 10, marginBottom: 12, borderColor: "#E5E7EB" },
  itemText: { fontSize: 16 },
});
