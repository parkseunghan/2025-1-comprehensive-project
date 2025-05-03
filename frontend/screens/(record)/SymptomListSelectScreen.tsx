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
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BackButton from "@/common/BackButton";
import { useAuthStore } from "@/store/auth.store";
import { createSymptomRecord } from "@/services/record.api";
import { requestPrediction, requestPredictionToDB } from "@/services/prediction.api";
import { calculateRiskLevel, generateGuideline } from "@/utils/risk-utils";

// ✅ 예시 증상 리스트 (API 연동 시 fetchAllSymptoms로 교체 가능)
const symptomOptions = [
    "기침",
    "발열",
    "복통",
    "두통",
    "인후통",
    "오한",
    "메스꺼움",
];

export default function SymptomListSelectScreen() {
    const { user } = useAuthStore();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    const [selected, setSelected] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
            const riskLevel = calculateRiskLevel(top1.riskScore);
            const guideline = generateGuideline(riskLevel);

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

            <View style={styles.body}>
                <Text style={styles.title}>증상을 선택해 주세요</Text>

                <FlatList
                    data={symptomOptions}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.symptomItem,
                                selected.includes(item) && styles.symptomItemSelected,
                            ]}
                            onPress={() => toggleSymptom(item)}
                        >
                            <Text
                                style={[
                                    styles.symptomText,
                                    selected.includes(item) && styles.symptomTextSelected,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            </View>

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
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#111827",
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
