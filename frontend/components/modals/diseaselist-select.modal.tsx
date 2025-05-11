import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { Disease } from "@/types/disease.types";

interface Props {
  visible: boolean;
  category: string;
  diseaseList: Disease[];
  selected: string[];
  onToggle: (id: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function DiseaseListSelectModal({
  visible,
  category,
  diseaseList,
  selected,
  onToggle,
  onSave,
  onClose,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = diseaseList
    .filter((d) => d.category === category)
    .filter((d) => d.name.includes(searchQuery));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={[
          styles.overlay,
          { pointerEvents: visible ? "auto" : "none" },
        ]}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{category} 관련 질병</Text>

          {/* 🔍 검색창 */}
          <TextInput
            placeholder="질병명을 입력하세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />

          {/* 🔽 스크롤뷰 */}
          <ScrollView style={styles.scrollArea}>
            {filtered.map((d) => (
              <TouchableOpacity
                key={d.sickCode}
                onPress={() => onToggle(d.sickCode)}
                style={styles.item}
              >
                <Text style={[styles.text, selected.includes(d.sickCode) && styles.selected]}>
                  {d.name} {selected.includes(d.sickCode) && "✔"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ✅ 버튼 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.cancel}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.button}>
              <Text style={styles.confirm}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: "black",
  },
  scrollArea: {
    maxHeight: SCREEN_HEIGHT * 0.5,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
  },
  selected: {
    color: "#D92B4B",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  cancel: {
    color: "#6B7280",
    fontWeight: "bold",
  },
  confirm: {
    color: "#D92B4B",
    fontWeight: "bold",
  },
});
