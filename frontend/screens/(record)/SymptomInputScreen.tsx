// 📄 screens/(record)/SymptomInputScreen.tsx
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuthStore } from "@/store/auth.store";
import { extractSymptoms } from "@/services/llm.api";
import { createSymptomRecord } from "@/services/record.api";
import { requestPrediction } from "@/services/prediction.api";
import { LLMExtractKeyword } from "@/types/symptom";

export default function SymptomInputScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDiagnosis = async () => {
    if (!text.trim()) {
      Alert.alert("⚠️ 증상을 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);

      // 1️⃣ LLM 증상 추출
      const extracted: LLMExtractKeyword[] = await extractSymptoms(text);

      if (extracted.length === 0) {
        Alert.alert("⚠️ 증상 키워드를 추출하지 못했어요.");
        return;
      }

      // 2️⃣ 증상 기록 생성 (빈 symptomIds 전달)
      const record = await createSymptomRecord({
        userId: user!.id,
        symptomIds: [],
      });

      // 3️⃣ 로컬에 기록 ID 저장
      await AsyncStorage.setItem("lastRecordId", record.id);

      // 4️⃣ 예측 요청
      await requestPrediction({
        recordId: record.id,
        symptoms: extracted,
      });

      // 5️⃣ 결과 화면으로 이동
      router.push("/(record)/result");
    } catch (err) {
      console.error("❌ 예측 실패:", err);
      Alert.alert("예측 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* ✅ 사용자 안내 */}
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        👤 {user?.name}님, 현재 프로필이 반영됩니다.
      </Text>

      {/* ✅ 증상 입력 */}
      <Text style={{ fontSize: 14, marginBottom: 4 }}>현재 증상을 입력해 주세요:</Text>
      <TextInput
        placeholder="예: 기침이 심하고 열이 나요. 배도 아파요"
        multiline
        numberOfLines={3}
        value={text}
        onChangeText={setText}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      {/* ✅ 버튼 */}
      <TouchableOpacity
        onPress={handleStartDiagnosis}
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>예측 시작</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
