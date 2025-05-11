import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Image,
} from "react-native";
import { Medication } from "@/types/medication.types";

interface Props {
  visible: boolean;
  onClose: () => void;
  medication: (Medication & { exportNameParsed?: string }) | null;
}

export default function MedicationDetailModal({ visible, onClose, medication }: Props) {
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

  if (!medication) return null;

  const displayName = medication.name.replace(/\(수출명\s*:\s*.*?\)/g, "").trim();

  const imageSource = medication.imageUrl
    ? { uri: medication.imageUrl }
    : require("@/images/AJINGA_LOGO.png");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            pointerEvents: visible ? "auto" : "none", // 🔧 Web 경고 해결
          },
        ]}
      >
        <Animated.View style={[styles.modal, { opacity: fadeAnim }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>{displayName}</Text>

            {medication.exportNameParsed && (
              <Text style={styles.exportName}>
                수출명: {medication.exportNameParsed}
              </Text>
            )}

            {[
              { label: "💊 효능", value: medication.efcy },
              { label: "📝 사용법", value: medication.useMethod },
              { label: "⚠️ 주의사항", value: medication.atpn },
              { label: "❗ 경고", value: medication.atpnWarn },
              { label: "🔄 상호작용", value: medication.intrc },
              { label: "🚨 부작용", value: medication.se },
              { label: "📦 보관법", value: medication.depositMethod },
            ].map(({ label, value }) => (
              <View key={label}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.content}>
                  {value?.trim() || "정보 없음"}
                </Text>
              </View>
            ))}
          </ScrollView>

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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modal: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 180,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  exportName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
    color: "#4B5563",
  },
  content: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginTop: 16,
    backgroundColor: "#7F66FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
