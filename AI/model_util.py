# 📄 AI/model_util.py
# 모델 로드 및 예측 유틸 함수

import numpy as np

# ✅ 실제론 torch나 joblib로 불러와야 함
# 예: model = joblib.load("coarse_model.pkl")

def predict_coarse_fine(symptom_keywords, age, gender, bmi, diseases, medications):
    """
    coarse/fine 예측을 수행하는 더미 함수 (나중에 진짜 모델로 대체)
    """

    # ⚠️ 현재는 더미로 결과 반환
    if "기침" in symptom_keywords:
        coarse = "감기"
        fine = "독감"
        risk = 0.91
    else:
        coarse = "내과"
        fine = "위염"
        risk = 0.66

    return coarse, fine, risk
