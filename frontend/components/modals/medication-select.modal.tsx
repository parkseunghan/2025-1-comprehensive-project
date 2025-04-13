// 📄 src/components/modals/medication-select.modal.tsx

// 🔹 약물 선택 모달 컴포넌트
// 사용자가 복용 중인 약물을 다중 선택할 수 있는 팝업 창입니다.

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 🔸 props 타입 정의
interface Props {
  visible: boolean;               // 모달 열림 여부
  selected: string[];             // 현재 선택된 약물 목록
  medicationList: string[];      // 전체 약물 리스트
  isLoading?: boolean;            // 로딩 상태
  onClose: () => void;            // 닫기 버튼 동작
  onSave: (items: string[]) => void; // 저장 버튼 동작
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

  useEffect(() => {
    setSelectedItems(selected); // 모달 열릴 때 선택 초기화
  }, [visible]);

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>약물 선택</Text>

          {isLoading ? (
            <ActivityIndicator size="small" color="#D92B4B" />
          ) : (
            <FlatList
              data={medicationList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemRow}
                  onPress={() => toggleItem(item)}
                >
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
          )}

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

// 🔸 스타일 정의
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
