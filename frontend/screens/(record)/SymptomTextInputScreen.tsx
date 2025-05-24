// 📄 screens/(record)/SymptomTextInputScreen.tsx

import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { useAuthStore } from "@/store/auth.store";
import { useSymptomStore } from "@/store/symptom.store";

import { extractSymptoms } from "@/services/llm.api";
import { extractSymptomsWithNLP } from "@/services/nlp.api";
import { createSymptomRecord } from "@/services/record.api";
import { requestPrediction, requestPredictionToDB } from "@/services/prediction.api";

import { LLMExtractKeyword, NlpExtractResponse } from "@/types/symptom.types";
import LoadingScreen from "@/common/LoadingScreen";
import BackButton from "@/common/BackButton";

export default function SymptomTextInputScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const { user } = useAuthStore();
  const { selected: selectedSymptomKeywords } = useSymptomStore();

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const runPredictionPipeline = async (extracted: LLMExtractKeyword[]) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const record = await createSymptomRecord({
        userId: user!.id,
        symptoms: extracted.map((item) => item.symptom),
      });

      await AsyncStorage.setItem("lastRecordId", record.id);

      const aiPrediction = await requestPrediction({
        symptomKeywords: extracted.map((item) => item.symptom),
        age: user?.age || 0,
        gender: user?.gender || "",
        height: user?.height || 0,
        weight: user?.weight || 0,
        bmi: user?.bmi || 0,
        diseases: user?.diseases?.map((d) => d.name) || [],
        medications: user?.medications?.map((m) => m.name) || [],
      });

      const predictionRanks = aiPrediction.predictions.map((pred, i) => ({
        rank: i + 1,
        coarseLabel: pred.coarseLabel,
        fineLabel: pred.fineLabel,
        riskScore: pred.riskScore,
      }));

      await requestPredictionToDB({
        recordId: record.id,
        predictions: predictionRanks,
        age: user.age,
        bmi: user.bmi,
        gender: user.gender,
        diseases: user.diseases?.map((d) => d.id) ?? [],
        medications: user.medications?.map((m) => m.id) ?? [],
        symptomKeywords: extracted.map((item) => item.symptom),
      });

      router.push("/(record)/result");
    } catch (err) {
      console.error("❌ 예측 실패:", err);
      Alert.alert("예측 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosis = async (mode: "nlp" | "llm") => {
    if (!text.trim()) {
      Alert.alert("⚠️ 증상을 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);
      if (mode === "nlp") {
        const response: NlpExtractResponse = await extractSymptomsWithNLP(text);
        const extracted = response.results;

        if (extracted.length < 2) {
          Alert.alert(
            "⚠️ 추출된 증상이 부족합니다.",
            "최소 2개 이상의 증상을 입력하거나 문장을 구체적으로 작성해 주세요."
          );
          return;
        }

        await runPredictionPipeline(extracted);
      } else {
        const extracted = await extractSymptoms(text);

        if (extracted.length < 2) {
          Alert.alert(
            "⚠️ 추출된 증상이 부족합니다.",
            "최소 2개 이상의 증상을 입력하거나 문장을 구체적으로 작성해 주세요."
          );
          return;
        }

        await runPredictionPipeline(extracted);
      }
    } catch (err) {
      console.error("❌ 증상 추출 실패:", err);
      Alert.alert("예측 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, pointerEvents: "auto" }]}
    >
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.body}>
        <Text style={styles.greeting}>
          👤 {user?.name}님, 현재 프로필이 반영됩니다.
        </Text>
        <Text style={styles.inputLabel}>현재 증상을 입력해 주세요:</Text>
        <TextInput
          placeholder="예: 기침이 심하고 열이 나요. 배도 아파요"
          multiline
          numberOfLines={3}
          value={text}
          onChangeText={setText}
          style={styles.textInput}
        />
        <Text style={styles.inputLabel}>ℹ️  2개 이상의 증상을 입력해주세요.</Text>

        <Animated.View
          style={[
            styles.buttonWrapper,
            { transform: [{ translateY }], pointerEvents: "auto" },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleDiagnosis("nlp")}
            style={[styles.button, { marginBottom: 12 }]}
          >
            <Text style={styles.buttonText}>예측 시작 (NLP 기반)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDiagnosis("llm")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>예측 시작 (LLM 기반)</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 24,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  body: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 8,
    color: "#111827",
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: "#6B7280",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#111827",
  },
  buttonWrapper: {
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#D92B4B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
