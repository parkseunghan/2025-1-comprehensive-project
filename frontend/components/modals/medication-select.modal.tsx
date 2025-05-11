import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Medication } from "@/types/medication.types";

interface Props {
  visible: boolean;
  selected: string[];
  medicationList: Medication[];
  isLoading?: boolean;
  onClose: () => void;
  onSave: (items: string[]) => void;
}

export default function MedicationSelectModal({
  visible,
  selected,
  medicationList,
  isLoading = false,
  onClose,
  onSave,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedItems(selected);
    setSearchTerm("");
  }, [visible]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredList = medicationList.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <View
        style={[
          styles.overlay,
          { pointerEvents: visible ? "auto" : "none" }, // ✅ 경고 해결
        ]}
      >
        <View style={styles.container}>
          <Text style={styles.title}>복용 중인 약물 선택</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {isLoading ? (
            <ActivityIndicator size="small" color="#D92B4B" />
          ) : (
            <FlatList
              data={filteredList}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={{ paddingBottom: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemRow}
                  onPress={() => toggleItem(item.id)}
                >
                  <Ionicons
                    name={
                      selectedItems.includes(item.id)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color="#111827"
                    style={{ marginRight: 8 }}
                  />
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log("✅ 저장할 medication ID 배열:", selectedItems);
                onSave(selectedItems);
              }}
            >
              <Text style={styles.saveText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  container: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  list: {
    maxHeight: 300,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeText: {
    color: "#6B7280",
    fontSize: 15,
  },
  saveText: {
    color: "#D92B4B",
    fontWeight: "bold",
    fontSize: 15,
  },
});
