// 📄 app/(record)/CategorySelectScreen.tsx

import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchAllSymptoms } from "@/services/symptom.api";
import { Symptom } from "@/types/symptom.types";

export default function CategorySelectScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const symptoms = await fetchAllSymptoms();
        console.log("✅ symptom data:", symptoms); // 🔍 확인용 로그
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
      <Text style={styles.title}>대분류를 선택하세요</Text>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.item}
          onPress={() => router.push(`/record/symptomselectscreen?category=${category}`)}
        >
          <Text style={styles.itemText}>{category}</Text>
        </TouchableOpacity>
      ))}
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
  itemText: {
    fontSize: 16,
  },
});
