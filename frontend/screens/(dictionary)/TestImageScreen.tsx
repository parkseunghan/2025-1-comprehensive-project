// 📄 screens/TestImageScreen.tsx

import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

export default function TestImageScreen() {
  const imageUrl =
    "https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/152035092098000085";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💊 약물 이미지 테스트</Text>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
        onError={() => console.log("❌ 이미지 로드 실패")}
      />
      <Text style={styles.note}>이미지가 보이지 않으면 프록시 방식으로 전환이 필요합니다.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
