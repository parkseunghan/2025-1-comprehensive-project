// 📄 app/(record)/predicting-text.tsx

import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "@/common/LoadingScreen";

import { useAuthStore } from "@/store/auth.store";
import { extractSymptoms } from "@/services/llm.api";
import { extractSymptomsWithNLP } from "@/services/nlp.api";
import { createSymptomRecord } from "@/services/record.api";
import { requestPrediction, requestPredictionToDB } from "@/services/prediction.api";

export default function PredictingTextScreen() {
    const { user } = useAuthStore();

    useEffect(() => {
        const runPipeline = async () => {
            try {
                const text = await AsyncStorage.getItem("symptomText");
                const mode = await AsyncStorage.getItem("predictMode");

                if (!text || !mode) throw new Error("입력 정보가 없습니다.");

                let extracted = [];

                if (mode === "nlp") {
                    const response = await extractSymptomsWithNLP(text);
                    extracted = response.results;
                } else {
                    extracted = await extractSymptoms(text);
                }

                if (extracted.length === 0) {
                    alert("⚠️ 증상 추출에 실패했습니다.");
                    router.back();
                    return;
                }

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
                });

                router.replace("/(record)/result");
            } catch (err) {
                console.error("❌ 예측 실패:", err);
                alert("예측 중 오류가 발생했습니다.");
                router.back();
            }
        };

        runPipeline();
    }, []);

    return <LoadingScreen />;
}
