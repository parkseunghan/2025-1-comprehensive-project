import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Platform,
    Vibration,
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
import { Feather } from "@expo/vector-icons";

export default function SymptomTextInputScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    const { user } = useAuthStore();
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ✅ 경고 배너 상태
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    const [warningType, setWarningType] = useState<"default" | "critical">("default");
    const warningAnim = useRef(new Animated.Value(0)).current;

    const showWarningBanner = (message: string, type: "default" | "critical" = "default") => {
        setWarningMessage(message);
        setWarningType(type);
        setShowWarning(true);

        if (Platform.OS !== "web" && type === "critical") {
            Vibration.vibrate(300);
        }

        Animated.timing(warningAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const duration = type === "critical" ? 4000 : 2500;

        setTimeout(() => {
            Animated.timing(warningAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setShowWarning(false));
        }, duration);
    };

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
            showWarningBanner("예측 중 문제가 발생했습니다.", "default");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiagnosis = async (mode: "nlp" | "llm") => {
        if (!text.trim()) {
            showWarningBanner("증상을 입력해 주세요.", "default");
            return;
        }

        try {
            setIsLoading(true);
            if (mode === "nlp") {
                const response: NlpExtractResponse = await extractSymptomsWithNLP(text);
                const extracted = response.results;

                if (extracted.length < 2) {
                    showWarningBanner(
                        "추출된 증상이 부족합니다.\n문장을 더 구체적으로 입력해 주세요.",
                        "critical"
                    );
                    return;
                }

                await runPredictionPipeline(extracted);
            } else {
                const extracted = await extractSymptoms(text);

                if (extracted.length < 2) {
                    showWarningBanner(
                        "추출된 증상이 부족합니다.\n문장을 더 구체적으로 입력해 주세요.",
                        "critical"
                    );
                    return;
                }

                await runPredictionPipeline(extracted);
            }
        } catch (err) {
            console.error("❌ 증상 추출 실패:", err);
            showWarningBanner("예측 중 문제가 발생했습니다.", "default");
        } finally {
            setIsLoading(false);
        }
    };

    return isLoading ? (
        <LoadingScreen />
    ) : (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton />
                </View>

                <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
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
                        <Text style={styles.inputLabel}>
                            ℹ️  2개 이상의 증상을 입력해주세요.
                        </Text>

                        <Animated.View
                            style={[
                                styles.buttonWrapper,
                                { transform: [{ translateY }] },
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
            </View>

            {/* ✅ 경고 배너 */}
            {showWarning && (
                <Animated.View
                    style={[
                        styles.warningBanner,
                        warningType === "critical"
                            ? styles.criticalBanner
                            : styles.defaultBanner,
                        {
                            transform: [
                                {
                                    translateY: warningAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [100, 0],
                                    }),
                                },
                            ],
                            opacity: warningAnim,
                        },
                    ]}
                >
                    <Feather
                        name={warningType === "critical" ? "alert-triangle" : "alert-circle"}
                        size={18}
                        color={warningType === "critical" ? "#1F2937" : "#fff"}
                        style={{ marginRight: 6 }}
                    />
                    <Text
                        style={[
                            styles.warningText,
                            warningType === "critical" && {
                                color: "#1F2937",
                                fontWeight: "600",
                            },
                        ]}
                    >
                        {warningMessage}
                    </Text>
                </Animated.View>
            )}
        </>
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
    warningBanner: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    defaultBanner: {
        backgroundColor: "#DC2626", // 빨강
    },
    criticalBanner: {
        backgroundColor: "#FACC15", // 노랑
    },
    warningText: {
        fontSize: 14,
        flexShrink: 1,
        color: "#ffffff",
    },
});
