import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMedications } from "@/services/medication.api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/common/BackButton";
import { Medication } from "@/types/medication.types";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import MedicationDetailModal from "@/modals/medication-detail.modal";
import AJINGA_LOGO from "@/images/AJINGA_LOGO.png";

// ✅ 수출명 제거 유틸 함수
const extractItemName = (rawName: string): string => {
  return rawName.replace(/\(수출명\s*:\s*.*?\)/g, "").trim();
};

// ✅ 수출명만 추출
const extractExportName = (rawName: string): string | null => {
  const match = rawName.match(/\(수출명\s*:\s*(.*?)\)/);
  return match?.[1]?.trim() || null;
};

export default function MedicationScreen() {
  const { data, isLoading, error } = useQuery<Medication[]>({
      queryKey: ["medications"],
      queryFn: fetchAllMedications,
  });

  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<
      (Medication & { exportNameParsed?: string }) | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredMedications = useMemo(() => {
      if (!data) return [];
      return data.filter((m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [data, searchQuery]);

  const handlePressMedication = (med: Medication) => {
      setSelectedMedication({
          ...med,
          exportNameParsed: extractExportName(med.name),
      });
      setModalVisible(true);
  };

  if (isLoading) return <Text style={styles.center}>불러오는 중...</Text>;
  if (error) return <Text style={styles.center}>에러 발생!</Text>;

  return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={styles.header}>
              <BackButton />
              <View style={styles.titleRow}>
                  <FontAwesome5 name="pills" size={24} color="#D92B4B" />
                  <Text style={styles.title}>약물 도감</Text>
              </View>
          </View>

          <TextInput
              style={styles.searchInput}
              placeholder="약물 이름을 검색해보세요"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#111827"
          />

          <FlatList
              data={filteredMedications}
              keyExtractor={(item) => item.itemSeq}
              renderItem={({ item }) => {
                  const displayName = extractItemName(item.name);
                  const exportName = extractExportName(item.name);

                  return (
                      <TouchableOpacity onPress={() => handlePressMedication(item)}>
                          <View style={styles.card}>
                              <Image
                                  source={item.imageUrl ? { uri: item.imageUrl } : AJINGA_LOGO}
                                  style={styles.image}
                                  resizeMode="cover"
                              />
                              <View style={styles.cardText}>
                                  <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                                      {exportName && (
                                          <View style={styles.exportTagBox}>
                                              <Text style={styles.exportTag}>수출용</Text>
                                          </View>
                                      )}
                                      <Text style={styles.name}>
                                          {displayName}
                                      </Text>
                                  </View>

                                  <Text style={styles.efcy} numberOfLines={2}>
                                      {item.efcy || "효능 정보 없음"}
                                  </Text>
                              </View>
                          </View>
                      </TouchableOpacity>
                  );
              }}
              contentContainerStyle={{
                  paddingTop: 4,
                  paddingBottom: insets.bottom + 120,
              }}
          />

          <MedicationDetailModal
              visible={modalVisible}
              medication={selectedMedication}
              onClose={() => setModalVisible(false)}
          />

          <View style={[styles.fixedFooter, { paddingBottom: insets.bottom + 8 }]}>
              <Text style={styles.footerText}>
                  ※ 본 약물 정보는 식품의약품안전처 e약은요 API를 통해 수집되었으며,{"\n"}
                  별도의 이용 제한 없이 자유롭게 활용 가능합니다.
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
  title: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#111827",
      marginLeft: 10,
  },
  searchInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      marginBottom: 12,
      fontSize: 14,
      color: "#111827",
      backgroundColor: "#fff",
      borderColor: "#111827",
  },
  card: {
      flexDirection: "row",
      backgroundColor: "#f9fafb",
      borderRadius: 12,
      padding: 8,
      alignItems: "center",
      marginBottom: 8,
  },
  image: {
      width: 60,
      height: 60,
      marginRight: 12,
      borderRadius: 8,
      backgroundColor: "#E5E7EB",
  },
  cardText: {
      flex: 1,
  },
  name: {
      fontSize: 16,
      fontWeight: "700",
      color: "#111827",
  },
  exportTagBox: {
      backgroundColor: "#EDE9FE",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      marginRight: 6,
  },
  exportTag: {
      fontSize: 11,
      fontWeight: "600",
      color: "#5B21B6",
  },
  efcy: {
      fontSize: 13,
      color: "#4b5563",
      marginTop: 4,
      lineHeight: 18,
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
  fixedFooter: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderColor: "#e5e7eb",
  },
  footerText: {
      fontSize: 11,
      color: "#6b7280",
      textAlign: "center",
  },
});
