// 📄 screens/(home)/SettingScreen.tsx
// 설정 화면: 프로필 보기, 알림 설정, 계정 설정, 로그아웃 기능을 제공합니다.

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LogoutButton from "@/common/LogoutButton";

export default function SettingScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>설정</Text>
      </View>

      {/* 🔹 내 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 정보</Text>
        <SettingItem
          label="프로필 보기"
          icon="person-circle-outline"
          onPress={() => router.push("/(user)/profile-detail")}
        />
      </View>

      {/* 🔹 계정 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정</Text>
        <SettingItem label="비밀번호 변경" icon="lock-closed-outline" onPress={() => router.push("/(user)/change-password")}/>
        <SettingItem label="이메일 변경" icon="mail-outline" />

      </View>

      {/* 🔹 알림 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>알림</Text>
        <SettingItem label="푸시 알림 설정" icon="notifications-outline" />
        <SettingItem label="약 복용 알림 설정" icon="alarm-outline" />
      </View>

      {/* 🔹 앱 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>앱</Text>
        <SettingItem label="데이터 초기화" icon="refresh-outline" />
        <SettingItem label="앱 정보" icon="information-circle-outline" />
        <LogoutButton />
      </View>
    </ScrollView>
  );
}

type SettingItemProps = {
  label: string;
  icon: string;
  onPress?: () => void;
};

function SettingItem({ label, icon, onPress }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon as any} size={20} color="#6B7280" style={styles.icon} />
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    color: "#111827",
  },
});
