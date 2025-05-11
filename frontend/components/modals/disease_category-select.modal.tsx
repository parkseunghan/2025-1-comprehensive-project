// components/modals/disease_category-select.modal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

interface Props {
  visible: boolean;
  categories: string[];
  onSelect: (category: string) => void;
  onClose: () => void;
}

export default function DiseaseCategorySelectModal({ visible, categories, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>지병 카테고리 선택</Text>
          <ScrollView>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} style={styles.item} onPress={() => onSelect(cat)}>
                <Text style={styles.text}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  container: { margin: 40, padding: 20, backgroundColor: "white", borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" },
  text: { fontSize: 16 },
  closeButton: { marginTop: 20, alignItems: "center" },
  closeText: { color: "#D92B4B", fontWeight: "bold" },
});
