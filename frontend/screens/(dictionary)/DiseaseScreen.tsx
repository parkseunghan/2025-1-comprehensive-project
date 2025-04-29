// 📄 screens/DiseaseScreen.tsx

import { View, Text, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchAllDiseases } from "@/services/disease.api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Disease {
  id: string;
  name: string;
  description?: string;
  tips?: string;
}

export default function DiseaseScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["diseases"],
    queryFn: async () => {
      const res = await fetchAllDiseases();
      return res.data as Disease[];
    },
  });

  const insets = useSafeAreaInsets();

  if (isLoading) return <Text style={styles.center}>불러오는 중...</Text>;
  if (error) return <Text style={styles.center}>에러 발생!</Text>;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>🩺 질병 도감</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc}>{item.description || "설명 없음"}</Text>
            {item.tips && <Text style={styles.tip}>💡 {item.tips}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#f3f4f6", // gray-100
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  desc: { fontSize: 14, color: "#4b5563", marginBottom: 6 }, // gray-700
  tip: { fontSize: 13, color: "#10b981" }, // green-500
  center: { textAlign: "center", marginTop: 30 },
});
