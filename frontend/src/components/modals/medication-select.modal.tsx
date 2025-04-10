// 📄 src/components/modals/medication-select.modal.tsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  selected: string[];
  medicationList: string[]; // ✅ 외부에서 약물 리스트 전달받음
  onClose: () => void;
  onSave: (items: string[]) => void;
}

export default function MedicationSelectModal({
  visible,
  selected,
  medicationList,
  onClose,
  onSave,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    setSelectedItems(selected);
  }, [visible]);

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>약물 선택</Text>
          <FlatList
            data={medicationList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemRow} onPress={() => toggleItem(item)}>
                <Ionicons
                  name={selectedItems.includes(item) ? "checkbox" : "square-outline"}
                  size={20}
                  color="#111827"
                  style={{ marginRight: 8 }}
                />
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSave(selectedItems)}>
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
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
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
