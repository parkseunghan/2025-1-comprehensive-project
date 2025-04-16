// 📄 prediction.service.ts
// 파이썬 모델을 child_process로 실행하고 예측 결과를 파싱하여 반환

import { spawn } from "child_process";
import path from "path";

interface PredictionInput {
    userId: string;
    symptomKeywords: string[];
}

interface PredictionResult {
    recordId: string;
    coarse_label: string;
    top_predictions: { label: string; prob: number }[];
    risk_score: number;
    risk_level: string;
    recommendation: string;
    elapsed: number;
}

export const runPredictionModel = (input: PredictionInput): Promise<PredictionResult> => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, "../../AI/predict_demo.py");
        const jsonInput = JSON.stringify(input);

        const py = spawn("python", [scriptPath, jsonInput]);

        let output = "";
        let errorOutput = "";

        py.stdout.on("data", (data) => {
            output += data.toString();
        });

        py.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        py.on("close", (code) => {
            if (code !== 0) {
                console.error("[runPredictionModel] Python stderr:", errorOutput);
                return reject(new Error("파이썬 예측 실행 실패"));
            }
            try {
                const parsed = JSON.parse(output);
                return resolve(parsed);
            } catch (e) {
                return reject(new Error("예측 결과 JSON 파싱 오류: " + e));
            }
        });
    });
};
