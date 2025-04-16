"use strict";
// 📄 prediction.service.ts
// 파이썬 모델을 child_process로 실행하고 예측 결과를 파싱하여 반환
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPredictionModel = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const runPredictionModel = (input) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path_1.default.join(__dirname, "../../AI/predict_demo.py");
        const jsonInput = JSON.stringify(input);
        const py = (0, child_process_1.spawn)("python", [scriptPath, jsonInput]);
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
            }
            catch (e) {
                return reject(new Error("예측 결과 JSON 파싱 오류: " + e));
            }
        });
    });
};
exports.runPredictionModel = runPredictionModel;
