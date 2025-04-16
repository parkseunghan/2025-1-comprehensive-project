# predict_demo.py
"""
🎯 실시간 추론 전용 스크립트
- coarse + fine 모델 로드
- 샘플 입력 기반 predict_disease() 실행
"""

from scripts.predict_disease import predict_disease
from tensorflow.keras.models import load_model
from sentence_transformers import SentenceTransformer
from focal_loss import SparseCategoricalFocalLoss
import joblib
import os
import time 

# ✅ 한글 coarse 그룹명을 영문으로 매핑
GROUP_NAME_MAP = {
    "감기": "cold",
    "감염": "infection",
    "소화기": "digestive",
    "호흡기": "respiratory",
    "심혈관": "cardio"
}

# ✅ 모델 로드
print("📦 모델 로딩 중...")
coarse_model = load_model("models/model_coarse.h5")
groups = ["감기", "감염", "소화기", "호흡기", "심혈관"]
fine_models = {
    g: load_model(
        f"models/fine/model_fine_{GROUP_NAME_MAP[g]}.h5",
        custom_objects={"SparseCategoricalFocalLoss": SparseCategoricalFocalLoss(gamma=2.0)}
    ) for g in groups
}
coarse_le = joblib.load("models/coarse_label_encoder.pkl")
fine_label_encoders = {g: joblib.load(f"models/fine/fine_label_encoder_{GROUP_NAME_MAP[g]}.pkl") for g in groups}
scaler = joblib.load("models/scaler.pkl")
mlb_chronic = joblib.load("models/mlb_chronic.pkl")
mlb_meds = joblib.load("models/mlb_meds.pkl")
sbert_model = SentenceTransformer("snunlp/KR-SBERT-V40K-klueNLI-augSTS")

# ✅ 샘플 입력
sample = {
    "symptom_keywords": "기침, 가래, 두통, 입 맛 없음",
    "Age": 30,
    "Gender": "여성",
    "Height_cm": 155,
    "Weight_kg": 55,
    "BMI": 22.89,
    "chronic_diseases": ["없음"],
    "medications": ["없음"]
}

text_vector = sbert_model.encode([sample["symptom_keywords"].replace(",", " ")])



# ✅ 예측 실행
print("\n🤖 질병 예측 중...")
start_time = time.time()

result = predict_disease(
    sample,
    coarse_model,
    fine_models,
    coarse_le,
    fine_label_encoders,
    scaler,
    mlb_chronic,
    mlb_meds,
    sbert_model.encode([sample["symptom_keywords"].replace(",", " ")])
)

elapsed = round(time.time() - start_time, 2)

# ✅ 결과 출력
print("\n🎯 Top-3 예측 질병")
for i, pred in enumerate(result["top_predictions"], 1):
    label = pred["label"]
    prob = pred["prob"] * 100
    print(f"{i}. {label} ({prob:.1f}%)")

print(f"\n📊 위험도 점수: {result['risk_score']} / {result['risk_level']}")
print(f"⏱️ 추론 시간: {elapsed}초")