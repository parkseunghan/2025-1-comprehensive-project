import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Platform,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { Disease } from "@/types/disease.types";

interface Props {
  visible: boolean;
  disease: Disease | null;
  onClose: () => void;
}

export default function DiseaseDetailModal({ visible, disease, onClose }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            pointerEvents: visible ? "auto" : "none", // 🔧 경고 해결
          },
        ]}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.title}>{disease?.name}</Text>

          {disease?.englishName && (
            <Text style={styles.englishName}>
              ({disease.englishName})
            </Text>
          )}

          <Text style={styles.desc}>
            {disease?.description || "설명 없음"}
          </Text>

          {disease && (
            <Text style={styles.tip}>
              💡 {disease.tips?.trim() ? disease.tips : "tips 없음"}
            </Text>
          )}

          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>닫기</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "85%",
    ...Platform.select({
      web: {
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  englishName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#6B7280",
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 10,
    lineHeight: 20,
  },
  tip: {
    fontSize: 13,
    color: "#10b981",
    marginBottom: 16,
    lineHeight: 20,
  },
  closeBtn: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#7F66FF",
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
