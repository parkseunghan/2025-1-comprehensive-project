# 📄 model_util.py
# coarse + fine 예측 모델 유틸리티 (SBERT 기반 + 다중입력)
# - SBERT 유사도 기반 증상 임베딩
# - 수치/카테고리형 피처 처리 후 coarse/fine 예측

import os
import json
import joblib
import numpy as np
from typing import List, Optional

from tensorflow.keras.models import load_model
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# ✅ 기본 경로 설정
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# ✅ 모델 및 도구 불러오기
model_coarse = load_model(f"{BASE_DIR}/models/model_coarse.h5", compile=False)
coarse_encoder = joblib.load(f"{BASE_DIR}/models/coarse_label_encoder.pkl")
scaler = joblib.load(f"{BASE_DIR}/models/scaler.pkl")
mlb_chronic = joblib.load(f"{BASE_DIR}/models/mlb_chronic.pkl")
mlb_meds = joblib.load(f"{BASE_DIR}/models/mlb_meds.pkl")

# ✅ fine 모델 경로 설정
FINE_MODEL_MAP = {
    "cold": ("model_fine_cold.h5", "fine_label_encoder_cold.pkl"),
    "infection": ("model_fine_infection.h5", "fine_label_encoder_infection.pkl"),
    "digestive": ("model_fine_digestive.h5", "fine_label_encoder_digestive.pkl"),
    "respiratory": ("model_fine_respiratory.h5", "fine_label_encoder_respiratory.pkl"),
    "cardio": ("model_fine_cardio.h5", "fine_label_encoder_cardio.pkl"),
}

# ✅ coarse → fine 키워드 매핑
COARSE_MAP = {
    "감기": "cold",
    "감염": "infection",
    "소화기": "digestive",
    "호흡기": "respiratory",
    "심혈관": "cardio"
}

# ✅ symptomMap 로드
with open(f"{BASE_DIR}/data/processed/symptom_map.json", "r", encoding="utf-8") as f:
    symptom_map: dict[str, list[str]] = json.load(f)

# ✅ SBERT 모델 로드
sbert_model = SentenceTransformer("snunlp/KR-SBERT-V40K-klueNLI-augSTS")

# ✅ 유사도 기반 증상 벡터 추출 함수
def get_best_matching_vector(user_keywords: List[str]) -> np.ndarray:
    user_sentence = " ".join(user_keywords)
    user_vec = sbert_model.encode([user_sentence])

    disease_labels = list(symptom_map.keys())
    symptom_sentences = [" ".join(symptom_map[d]) for d in disease_labels]
    symptom_vecs = sbert_model.encode(symptom_sentences)

    scores = cosine_similarity(user_vec, symptom_vecs)[0]
    best_index = int(np.argmax(scores))

    return symptom_vecs[best_index]  # ✅ SBERT 벡터 반환

# ✅ 예측 함수 (coarse → fine)
def predict_coarse_fine(
    symptom_keywords: List[str],
    age: int,
    gender: int,  # 0: 남성, 1: 여성
    bmi: float,
    diseases: List[str],
    medications: List[str]
) -> tuple[str, Optional[str], float]:

    # 1. SBERT 증상 벡터
    sbert_vector = get_best_matching_vector(symptom_keywords).reshape(1, -1)

    # 2. 입력 피처 분리 (scaler는 4개 피처로 학습됨)
    numeric_input = pd.DataFrame([[age, height := 170, weight := 65, bmi]], columns=["Age", "Height_cm", "Weight_kg", "BMI"])
    scaled_numeric = scaler.transform(numeric_input)

    gender_vec = np.array([[gender]])
    chronic_vec = mlb_chronic.transform([diseases])
    meds_vec = mlb_meds.transform([medications])

    # 3. 최종 MLP 입력 벡터 구성
    mlp_input = np.hstack([scaled_numeric, gender_vec, chronic_vec, meds_vec])

    # 4. coarse 예측
    coarse_probs = model_coarse.predict([mlp_input, sbert_vector])[0]
    coarse_idx = int(np.argmax(coarse_probs))
    coarse_label = coarse_encoder.inverse_transform([coarse_idx])[0]
    risk_score = float(coarse_probs[coarse_idx])

    # 5. fine 분기 예측
    fine_label = None
    coarse_key = COARSE_MAP.get(coarse_label, coarse_label.lower())  # ✅ 한글 coarse 라벨 매핑
    if coarse_key in FINE_MODEL_MAP:
        model_path, encoder_path = FINE_MODEL_MAP[coarse_key]
        fine_model = load_model(f"{BASE_DIR}/models/fine/{model_path}", compile=False)
        fine_encoder = joblib.load(f"{BASE_DIR}/models/fine/{encoder_path}")

        fine_probs = fine_model.predict([mlp_input, sbert_vector])[0]
        fine_idx = int(np.argmax(fine_probs))
        fine_label = fine_encoder.inverse_transform([fine_idx])[0]

    return coarse_label, fine_label, risk_score