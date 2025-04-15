# main.py
"""
🚀 전체 실행 워크플로우 엔트리 포인트
- SBERT 임베딩 생성
- coarse 모델 학습
- fine 모델 학습
- 추론 테스트
"""

import os
import subprocess

print("Step 1: SBERT 임베딩 생성")
subprocess.run(["python", "scripts/embed_sbert_features.py"])

print("\nStep 2: coarse 모델 학습")
subprocess.run(["python", "scripts/train_coarse_model.py"])

print("\nStep 3: fine 모델 학습")
subprocess.run(["python", "scripts/train_fine_models.py"])

print("\nStep 4: 예측 테스트")
from scripts.predict_disease import predict_disease
from tensorflow.keras.models import load_model
import joblib
from sentence_transformers import SentenceTransformer

# 모델 로드
groups = ["감기", "감염", "소화기", "호흡기", "심혈관"]
coarse_model = load_model("models/model_coarse.h5")
fine_models = {g: load_model(f"models/fine/{g}.h5") for g in groups}
coarse_le = joblib.load("models/coarse_label_encoder.pkl")
fine_label_encoders = {g: joblib.load(f"models/fine_label_encoder_{g}.pkl") for g in groups}
scaler = joblib.load("models/scaler.pkl")
mlb_chronic = joblib.load("models/mlb_chronic.pkl")
mlb_meds = joblib.load("models/mlb_meds.pkl")
sbert_model = SentenceTransformer("snunlp/KR-SBERT-V40K-klueNLI-augSTS")

# 샘플 입력
sample = {
    "symptom_keywords": "기침, 가래, 가슴 답답함",
    "Age": 50, "Gender": "남성",
    "Height_cm": 175, "Weight_kg": 80, "BMI": 26.1,
    "chronic_diseases": ["고혈압"],
    "medications": ["항생제"]
}

# 예측
result = predict_disease(
    sample,
    coarse_model,
    fine_models,
    coarse_le,
    fine_label_encoders,
    scaler,
    mlb_chronic,
    mlb_meds,
    sbert_model
)

print("\n🎯 최종 예측 결과:")
print(result)