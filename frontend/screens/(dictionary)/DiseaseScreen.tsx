import { View, Text, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchAllDiseases } from "@/services/disease.api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/common/BackButton";
import { Disease } from "@/types/disease.types";

export default function DiseaseScreen() {
  const { data, isLoading, error } = useQuery<Disease[]>({
    queryKey: ["diseases"],
    queryFn: fetchAllDiseases,
  });

  const insets = useSafeAreaInsets();

  if (isLoading) return <Text style={styles.center}>불러오는 중...</Text>;
  if (error) return <Text style={styles.center}>에러 발생!</Text>;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <BackButton />
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
        contentContainerStyle={{ paddingBottom: 95 }} // ⬅️ 하단 여백 확보
      />

      {/* ✅ 하단 고정 저작권 표시 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Text style={styles.footerText}>
          ※ 본 질병 정보는 건강보험심사평가원_질병정보서비스 API를 활용하여 제공됩니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  desc: { fontSize: 14, color: "#4b5563", marginBottom: 6 },
  tip: { fontSize: 13, color: "#10b981" },
  center: { textAlign: "center", marginTop: 30 },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  footerText: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
  },
});