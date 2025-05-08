// 📄 screens/(record)/SymptomListSelectScreen.tsx

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BackButton from "@/common/BackButton";
import { useAuthStore } from "@/store/auth.store";
import { createSymptomRecord } from "@/services/record.api";
import { requestPrediction, requestPredictionToDB } from "@/services/prediction.api";
import { fetchAllSymptoms } from "@/services/symptom.api";
import { Symptom } from "@/types/symptom.types";

export default function SymptomListSelectScreen() {
  const { user } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [symptomMap, setSymptomMap] = useState<Record<string, string[]>>({});

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const loadSymptoms = async () => {
      try {
        const symptoms = await fetchAllSymptoms(); // [{ id, name, category }]
        const grouped: Record<string, string[]> = {};
        for (const s of symptoms) {
          if (!grouped[s.category]) grouped[s.category] = [];
          grouped[s.category].push(s.name);
        }
        setSymptomMap(grouped);
      } catch (err) {
        console.error("❌ 증상 불러오기 실패:", err);
        Alert.alert("증상 목록을 불러오지 못했습니다.");
      }
    };

    loadSymptoms();
  }, []);

  const toggleSymptom = (symptom: string) => {
    if (selected.includes(symptom)) {
      setSelected(selected.filter((s) => s !== symptom));
    } else {
      setSelected([...selected, symptom]);
    }
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      Alert.alert("⚠️ 최소 한 가지 증상을 선택해 주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const record = await createSymptomRecord({
        userId: user!.id,
        symptoms: selected,
      });

      await AsyncStorage.setItem("lastRecordId", record.id);

      const aiPrediction = await requestPrediction({
        symptomKeywords: selected,
        age: user?.age || 0,
        gender: user?.gender === "남성" ? "남성" : "여성",
        height: user?.height || 0,
        weight: user?.weight || 0,
        bmi: user?.bmi || 0,
        diseases: user?.diseases?.map((d) => d.name) || [],
        medications: user?.medications?.map((m) => m.name) || [],
      });

      const top1 = aiPrediction.predictions[0];

      const predictionRanks = aiPrediction.predictions.map((pred, i) => ({
        rank: i + 1,
        coarseLabel: pred.coarseLabel,
        fineLabel: pred.fineLabel,
        riskScore: pred.riskScore,
      }));

      await requestPredictionToDB({
        recordId: record.id,
        predictions: predictionRanks,
      });

      router.push("/(record)/result");
    } catch (err) {
      console.error("❌ 예측 실패:", err);
      Alert.alert("예측 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>증상을 선택해 주세요</Text>

        {Object.entries(symptomMap).map(([category, symptoms]) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {symptoms.map((name) => (
              <TouchableOpacity
                key={name}
                style={[
                  styles.symptomItem,
                  selected.includes(name) && styles.symptomItemSelected,
                ]}
                onPress={() => toggleSymptom(name)}
              >
                <Text
                  style={[
                    styles.symptomText,
                    selected.includes(name) && styles.symptomTextSelected,
                  ]}
                >
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>예측 시작</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
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
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    color: "#4B5563",
  },
  symptomItem: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  symptomItemSelected: {
    backgroundColor: "#D92B4B",
  },
  symptomText: {
    fontSize: 16,
    color: "#374151",
  },
  symptomTextSelected: {
    color: "#ffffff",
  },
  buttonWrapper: {
    padding: 16,
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
