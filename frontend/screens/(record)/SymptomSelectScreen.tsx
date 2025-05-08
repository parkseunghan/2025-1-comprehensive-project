// 📄 app/(record)/SymptomSelectScreen.tsx

import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchAllSymptoms } from "@/services/symptom.api";
import { Symptom } from "@/types/symptom.types";
import { useSymptomStore } from "@/store/symptom.store"; // Zustand 스토어

export default function SymptomSelectScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const { selected, toggle } = useSymptomStore();

  useEffect(() => {
    const fetch = async () => {
      const all = await fetchAllSymptoms();
      setSymptoms(all.filter((s) => s.category === category));
    };
    fetch();
  }, [category]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{category} 증상 선택</Text>
      {symptoms.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[styles.item, selected.includes(s.name) && styles.itemSelected]}
          onPress={() => toggle(s.name)}
        >
          <Text
            style={[styles.itemText, selected.includes(s.name) && styles.itemTextSelected]}
          >
            {s.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>◀ 뒤로가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#E5E7EB",
  },
  itemSelected: {
    backgroundColor: "#D92B4B",
  },
  itemText: {
    fontSize: 16,
    color: "#374151",
  },
  itemTextSelected: {
    color: "#ffffff",
  },
  backBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  backBtnText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
});
