import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchAllDiseases } from "@/services/disease.api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/common/BackButton";
import { Disease } from "@/types/disease.types";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import DiseaseDetailModal from "@/modals/disease-detail.modal";

export default function DiseaseScreen() {
  const { data, isLoading, error } = useQuery<Disease[]>({
      queryKey: ["diseases"],
      queryFn: fetchAllDiseases,
  });

  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePressDisease = (disease: Disease) => {
      setSelectedDisease(disease);
      setModalVisible(true);
  };

  const filteredDiseases = useMemo(() => {
      if (!data) return [];
      return data.filter((d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [data, searchQuery]);

  if (isLoading) return <Text style={styles.center}>불러오는 중...</Text>;
  if (error) return <Text style={styles.center}>에러 발생!</Text>;

  return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* ✅ 상단 고정 백버튼 + 아이콘 + 타이틀 */}
          <View style={styles.header}>
              <BackButton />
              <View style={styles.titleRow}>
                  <View style={styles.iconCircle}>
                      <Feather name="book-open" size={24} color="#7F66FF" />
                  </View>
                  <Text style={styles.title}>질병 도감</Text>
              </View>
          </View>

          {/* ✅ 검색창 */}
          <TextInput
              style={[
                  styles.searchInput,
                  { borderColor: "#111827" }, // 테두리 검정
              ]}
              placeholder="궁금한 질병이 있으신가요?"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#111827" // placeholder 텍스트 검정
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
          />

          {/* ✅ 질병 리스트 */}
          <FlatList
              data={filteredDiseases}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handlePressDisease(item)}>
                      <View style={styles.card}>
                          <Text style={styles.name}>{item.name}</Text>
                          <Text style={styles.desc} numberOfLines={2}>
                              {item.description || "설명 없음"}
                          </Text>
                      </View>
                  </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              contentContainerStyle={{ paddingBottom: 95, paddingTop: 4 }}
              ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
              )}
          />

          {/* ✅ 상세 모달 */}
          <DiseaseDetailModal
              visible={modalVisible}
              disease={selectedDisease}
              onClose={() => setModalVisible(false)}
          />

          {/* ✅ 저작권 */}
          <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
              <Text style={styles.footerText}>
                  ※ 본 질병 정보는 건강보험심사평가원_질병정보서비스 API를 활용하여 제공됩니다.
              </Text>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#ffffff",
      paddingHorizontal: 16,
  },
  header: {
      paddingTop: 24,
      marginBottom: 12,
  },
  titleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
  },
  iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#EFE9FF",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
  },
  title: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#111827",
  },
  searchInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      marginBottom: 12,
      fontSize: 14,
      color: "#111827", // 입력 텍스트 색
      backgroundColor: "#fff",
  },
  card: {
      backgroundColor: "#f3f4f6",
      borderRadius: 12,
      padding: 16,
  },
  name: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 4,
  },
  desc: {
      fontSize: 14,
      color: "#4b5563",
  },
  emptyText: {
      textAlign: "center",
      color: "#9CA3AF",
      fontSize: 14,
      marginTop: 40,
  },
  center: {
      textAlign: "center",
      marginTop: 30,
  },
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
