# 📄 AI/scripts/model_util.py

import numpy as np
import joblib
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import os

# ---------------------
# ✅ 모델 & 인코더 로딩
# ---------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Coarse
model_coarse = load_model(f"{BASE_DIR}/models/model_coarse.h5")
coarse_encoder = joblib.load(f"{BASE_DIR}/models/coarse_label_encoder.pkl")

# Scaler & multi-label encoders
scaler = joblib.load(f"{BASE_DIR}/models/scaler.pkl")
mlb_chronic = joblib.load(f"{BASE_DIR}/models/mlb_chronic.pkl")
mlb_meds = joblib.load(f"{BASE_DIR}/models/mlb_meds.pkl")

# Fine 모델 & 인코더 맵
FINE_MODEL_MAP = {
    "cold": ("model_fine_cold.h5", "fine_label_encoder_cold.pkl"),
    "infection": ("model_fine_infection.h5", "fine_label_encoder_infection.pkl"),
    "digestive": ("model_fine_digestive.h5", "fine_label_encoder_digestive.pkl"),
    "respiratory": ("model_fine_respiratory.h5", "fine_label_encoder_respiratory.pkl"),
    "cardio": ("model_fine_cardio.h5", "fine_label_encoder_cardio.pkl"),
}

# SBERT 벡터 불러오기 (전체)
sbert_vectors = np.load(f"{BASE_DIR}/data/processed/leaned_sbert_text_features_final.npy")
# SBERT 인덱스 매핑용 키워드 (샘플 예시)
sbert_keywords_list = [
    ["기침"], ["콧물"], ["복통"], ["가슴 통증"], ["두통"], ["호흡 곤란"]
]  # 이 부분은 실제 학습에 사용한 키워드 리스트와 맞춰야 함


# ---------------------
# ✅ SBERT 키워드 매핑 (간단한 버전)
# ---------------------
def get_sbert_vector(input_keywords):
    for i, keywords in enumerate(sbert_keywords_list):
        if set(keywords) == set(input_keywords):
            return sbert_vectors[i]
    return np.zeros(384)  # 매칭 실패 시 기본 벡터


# ---------------------
# ✅ 전체 예측 함수
# ---------------------
def predict_coarse_fine(symptom_keywords, age, gender, bmi, diseases, medications):
    # 1. SBERT 임베딩 벡터
    sbert_vector = get_sbert_vector(symptom_keywords)

    # 2. 숫자/카테고리형 feature 처리
    num_features = np.array([[age, gender, bmi]])
    chronic_vec = mlb_chronic.transform([diseases])
    meds_vec = mlb_meds.transform([medications])

    # 3. 전체 feature 합치기
    full_input = np.hstack([sbert_vector, num_features[0], chronic_vec[0], meds_vec[0]])
    scaled_input = scaler.transform([full_input])

    # 4. coarse 예측
    coarse_probs = model_coarse.predict(scaled_input)[0]
    coarse_idx = np.argmax(coarse_probs)
    coarse_label = coarse_encoder.inverse_transform([coarse_idx])[0]
    risk_score = float(coarse_probs[coarse_idx])

    # 5. coarse 그룹에 따라 fine 분기
    fine_label = None
    coarse_key = coarse_label.lower()  # 예: "cold"
    if coarse_key in FINE_MODEL_MAP:
        model_path, encoder_path = FINE_MODEL_MAP[coarse_key]
        fine_model = load_model(f"{BASE_DIR}/models/fine/{model_path}")
        fine_encoder = joblib.load(f"{BASE_DIR}/models/fine/{encoder_path}")

        fine_probs = fine_model.predict(scaled_input)[0]
        fine_idx = np.argmax(fine_probs)
        fine_label = fine_encoder.inverse_transform([fine_idx])[0]

    return coarse_label, fine_label, risk_score
