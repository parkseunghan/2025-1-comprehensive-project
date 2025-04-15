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
def predict_disease(
    sample,
    coarse_model,
    fine_models,
    coarse_le,
    fine_label_encoders,
    scaler,
    mlb_chronic,
    mlb_meds,
    text_vector  # shape: (1, 384) 정도의 numpy 배열
):
    # ✅ 텍스트 벡터 reshape 보정
    if text_vector.ndim == 1:
        text_vector = text_vector.reshape(1, -1)

    # ✅ 수치형 정규화
    numeric = np.array([
        sample["Age"], sample["Height_cm"], sample["Weight_kg"], sample["BMI"]
    ]).reshape(1, -1)
    numeric = scaler.transform(numeric)

    # ✅ 범주형 처리
    gender = np.array([[1 if sample["Gender"] == "남성" else 0]])
    chronic = mlb_chronic.transform([sample["chronic_diseases"]])
    meds = mlb_meds.transform([sample["medications"]])

    # ✅ 최종 MLP 입력
    mlp_input = np.concatenate([numeric, gender, chronic, meds], axis=1)

    # ✅ coarse 예측
    coarse_pred = coarse_model.predict([mlp_input, text_vector], verbose=0)
    coarse_idx = np.argmax(coarse_pred, axis=1)[0]
    coarse_label = coarse_le.inverse_transform([coarse_idx])[0]

    # ✅ fine 분기 예측
    fine_model = fine_models[coarse_label]
    fine_encoder = fine_label_encoders[coarse_label]
    fine_pred = fine_model.predict([mlp_input, text_vector], verbose=0)

    # ✅ Top-3 예측 추출
    top_indices = np.argsort(fine_pred[0])[::-1][:3]
    top_labels = fine_encoder.inverse_transform(top_indices)
    top_probs = fine_pred[0][top_indices]

    # ✅ 위험도 계산 반영
    risk_score, risk_level, guide = calculate_risk_score(sample, top_probs[0])

    return {
        "coarse_label": coarse_label,
        "top_predictions": [
            {"label": top_labels[i], "prob": round(top_probs[i], 4)}
            for i in range(len(top_labels))
        ],
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendation": guide
    }
