import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

const PRIMARY_COLOR = "#D92B4B"; // 아이덴티티 색상

export default function AppInfoScreen() {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 헤더 */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="#111827"
          onPress={() => router.push("/(tabs)/setting")}
        />
        <Text style={styles.headerTitle}>앱 정보</Text>
      </View>

      {/* 앱 아이콘 */}
      <View style={styles.iconContainer}>
        <Image
          source={require("@/images/AJINGA_LOGO.png")}
          style={styles.appIcon}
          resizeMode="contain"
        />
      </View>

      {/* 브랜드명 + 버전 */}
      <Text style={styles.title}>AI 내과 진단 도우미</Text>
      <Text style={styles.version}>v{appVersion}</Text>

      {/* 정보 카드 */}
      <View style={styles.infoBox}>
        <InfoItem label="개발자" value="이승겸, 박승한, 장준호" />
        <InfoItem
          label="기술 스택"
          value={`React Native (Expo)\nTypeScript, Node.js, Express\nPostgreSQL, Prisma, Mistral, BERT`}
        />
        <InfoItem label="라이선스" value="MIT License" />
      </View>

      {/* 하단 문구 */}
      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={18} color="#9CA3AF" />
        <Text style={styles.footerText}>본 앱은 학습 목적의 데모 앱입니다.</Text>
      </View>
    </ScrollView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#111827",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  appIcon: {
    width: 140,
    height: 140,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 12,
  },
  version: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: PRIMARY_COLOR,
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#9CA3AF",
  },
});
