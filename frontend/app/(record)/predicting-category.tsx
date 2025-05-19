// 📄 app/(record)/predicting-category.tsx

import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "@/common/LoadingScreen";
import { useAuthStore } from "@/store/auth.store";
import { useSymptomStore } from "@/store/symptom.store";
import { createSymptomRecord } from "@/services/record.api";
import { requestPrediction, requestPredictionToDB } from "@/services/prediction.api";

export default function PredictingCategoryScreen() {
    const { user } = useAuthStore();
    const { selected } = useSymptomStore();

    useEffect(() => {
        const runPrediction = async () => {
            try {
                const record = await createSymptomRecord({
                    userId: user!.id,
                    symptoms: selected,
                });

                await AsyncStorage.setItem("lastRecordId", record.id);

                const aiPrediction = await requestPrediction({
                    symptomKeywords: selected,
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
                    age: user?.age || 0,
                    gender: user?.gender || "",
                    bmi: user?.bmi || 0,
                    diseases: user?.diseases?.map((d) => d.id) || [],
                    medications: user?.medications?.map((m) => m.id) || [],
                    symptomKeywords: selected,
                });

                router.replace("/(record)/result");
            } catch (err) {
                console.error("❌ 예측 실패:", err);
                alert("예측 중 오류가 발생했습니다.");
                router.back();
            }
        };

        runPrediction();
    }, []);

    return <LoadingScreen />;
}
