// 📄 screens/(home)/HomeScreen.tsx
// 홈 화면입니다. 로그인된 사용자의 정보를 배너로 표시하며, 주요 기능으로 이동할 수 있는 버튼들을 제공합니다.

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import { router } from "expo-router";
  import { useQuery } from "@tanstack/react-query";
  
  import { useAuthStore } from "@/store/auth.store"; // ✅ 로그인 상태
  import { fetchCurrentUser } from "@/services/user.api"; // ✅ 사용자 전체 프로필 정보
  
  export default function HomeScreen() {
    const { user } = useAuthStore();
  
    const { data: profile } = useQuery({
      queryKey: ["user", user?.id],
      queryFn: () => fetchCurrentUser(user!.id),
      enabled: !!user?.id,
    });
  
    return (
      <ScrollView
        style={{ backgroundColor: "#ffffff" }}
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
      >
        {/* 🔹 상단 텍스트 */}
        <View style={styles.profileRow}>
          <Text style={styles.profileText}>프로필</Text>
        </View>
  
        {/* 🔹 사용자 정보 배너 */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>
            {profile?.age}세 {profile?.gender} / {profile?.height}cm · {profile?.weight}kg
          </Text>
          <Text style={styles.bannerSub}>
            지병:{" "}
            {profile?.diseases?.length
              ? profile.diseases.map((d: { name: string }) => d.name).join(", ")
              : "없음"}{" "}
            | 약물:{" "}
            {profile?.medications?.length
              ? profile.medications.map((m: { name: string }) => m.name).join(", ")
              : "없음"}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(user)/profile-detail")}
          >
            <Text style={styles.startText}>자세히 보기 &gt;</Text>
          </TouchableOpacity>
        </View>
  
        {/* 🔹 기능 타이틀 */}
        <Text style={styles.sectionTitle}>기능</Text>
        <Text style={styles.sectionSub}>주요 기능들을 바로 확인해보세요</Text>
  
        {/* 🔹 기능 카드 */}
        <View style={styles.grid}>
          {[
            { label: "자가진단", icon: "🩺", link: "/(record)/symptom" },
            { label: "건강 통계", icon: "📊" },
            { label: "의료 도감", icon: "📖" },
            { label: "기록 보기", icon: "🗂️", link: "/(tabs)/history" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => item.link && router.push(item.link)}
            >
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: "#ffffff",
    },
    profileRow: {
      marginBottom: 24,
    },
    profileText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#111827",
    },
    banner: {
      backgroundColor: "#EEF2FF",
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
    },
    bannerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#3730A3",
      marginBottom: 6,
    },
    bannerSub: {
      fontSize: 14,
      color: "#4B5563",
      marginBottom: 10,
    },
    startText: {
      color: "#3B82F6",
      fontWeight: "bold",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
      color: "#111827",
    },
    sectionSub: {
      fontSize: 13,
      color: "#6B7280",
      marginBottom: 12,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
    },
    card: {
      width: "47%",
      height: 100,
      backgroundColor: "#F9FAFB",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
      elevation: 1,
    },
    cardIcon: {
      fontSize: 24,
      marginBottom: 6,
    },
    cardLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#111827",
    },
  });
  