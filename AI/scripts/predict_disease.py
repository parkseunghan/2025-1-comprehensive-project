# predict_disease.py
"""
🎯 내과 질환 예측 통합 추론 스크립트
- coarse 모델 → fine 분기 → 위험도 계산
- 사용자 입력 딕셔너리 기반 예측 수행
"""

import numpy as np
import joblib
from tensorflow.keras.models import load_model
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import StandardScaler, MultiLabelBinarizer

# 위험도 계산 함수
def calculate_risk_score(input_dict, confidence):
    W1, W2, W3, W4, W5, W6 = 1, 1, 1, 1, 1, 1

    S = 1.0
    risk_diseases = ["고혈압", "당뇨", "심부전", "협심증"]
    C = 1.2 if any(d in input_dict["chronic_diseases"] for d in risk_diseases) else 1.0
    A = 1.2 if input_dict["Age"] >= 60 else 1.0
    G = 1.0
    B = 1.3 if input_dict["BMI"] < 18.5 or input_dict["BMI"] >= 25 else 1.0
    risk_meds = ["면역억제제", "항생제"]
    M = 1.1 if any(m in input_dict["medications"] for m in risk_meds) else 1.0

    score = confidence * (W1*S + W2*C + W3*A + W4*G + W5*B + W6*M)
    score = round(score, 2)

    if score < 1.5:
        level, guide = "낮음", "현재 상태에서 자가 관리가 가능합니다."
    elif score < 3.0:
        level, guide = "보통", "전문가 상담을 권장합니다."
    elif score < 4.5:
        level, guide = "높음", "빠른 병원 방문이 필요합니다."
    else:
        level, guide = "응급", "즉시 응급실 방문이 필요합니다. 119에 연락하세요."

    return score, level, guide

# 전처리 함수 (입력 → MLP + 텍스트 벡터)
def preprocess_input(input_dict, scaler, mlb_chronic, mlb_meds, sbert_model):
    gender_map = {"남성": 1, "여성": 0}

    # SBERT 임베딩
    text_embedding = sbert_model.encode([input_dict["symptom_keywords"]])[0].reshape(1, -1)

    # 수치 스케일링
    num_input = np.array([
        input_dict["Age"],
        input_dict["Height_cm"],
        input_dict["Weight_kg"],
        input_dict["BMI"]
    ]).reshape(1, -1)
    num_scaled = scaler.transform(num_input)

    gender = np.array([[gender_map.get(input_dict["Gender"], 0)]])
    chronic_bin = mlb_chronic.transform([input_dict["chronic_diseases"]])
    meds_bin = mlb_meds.transform([input_dict["medications"]])

    mlp_input = np.concatenate([num_scaled, gender, chronic_bin, meds_bin], axis=1)
    return mlp_input, text_embedding

# 통합 예측 함수
def predict_disease(input_dict, coarse_model, fine_models, coarse_le, fine_label_encoders,
                    scaler, mlb_chronic, mlb_meds, sbert_model):
    mlp_input, text_input = preprocess_input(input_dict, scaler, mlb_chronic, mlb_meds, sbert_model)

    # coarse 예측
    coarse_probs = coarse_model.predict([mlp_input, text_input])
    coarse_idx = np.argmax(coarse_probs)
    coarse_label = coarse_le.inverse_transform([coarse_idx])[0]

    # fine 예측
    fine_model = fine_models[coarse_label]
    fine_le = fine_label_encoders[coarse_label]
    fine_probs = fine_model.predict([mlp_input, text_input])
    fine_idx = np.argmax(fine_probs)
    fine_label = fine_le.inverse_transform([fine_idx])[0]
    confidence = round(float(fine_probs[0][fine_idx]), 4)

    # 위험도 계산
    risk_score, risk_level, recommendation = calculate_risk_score(input_dict, confidence)

    return {
        "coarse_label": coarse_label,
        "fine_prediction": fine_label,
        "confidence": confidence,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendation": recommendation
    }
