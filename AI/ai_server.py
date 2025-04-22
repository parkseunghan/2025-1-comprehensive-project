# 📄 AI/ai_server.py
# FastAPI 기반 AI 모델 예측 서버
# 클라이언트로부터 증상, 프로필 데이터를 받아 coarse + fine 질병 예측 결과를 반환합니다.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from model_util import predict_coarse_fine
import uvicorn

import numpy as np

# ✅ 예시용: 미리 학습된 모델 불러오기 (직렬화 파일)
# 실제 적용 시 torch, joblib 등으로 로드할 수 있음
# 예: from model_util import predict_coarse_fine

app = FastAPI()

# -------------------------------
# 📌 입력 데이터 스키마 정의(백엔드가 요청할 때 보낼 데이터 형식)
# -------------------------------
class PredictRequest(BaseModel):
    gender: str            # 예: "남성"
    age: int               # 예: 25
    height: int            # 예: 170
    weight: int            # 예: 60
    chronic_diseases: List[str]  # 예: ["당뇨병"]
    medications: List[str]       # 예: ["타이레놀"]
    symptom_keywords: List[str]  # 예: ["기침", "콧물", "인후통"]

# -------------------------------
# 📌 응답 데이터 스키마 정의(예측한 결과를 어떤 형식으로 응답할지 정의의)
# -------------------------------
class PredictResponse(BaseModel):
    coarseLabel: str               # coarse 분류 결과 예: "감기"
    riskScore: float               # 위험도 (0~1 사이)
    fineLabel: Optional[str] = None  # fine 분류 결과 예: "독감"

# -------------------------------
# 🔮 예측 API
# -------------------------------
@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        # ✅ BMI 계산
        height_m = request.height / 100
        bmi = request.weight / (height_m ** 2)

        # ✅ 성별 숫자 변환
        gender_num = 0 if request.gender == "남성" else 1

        # ✅ 예측 함수 호출
        coarse, fine, risk = predict_coarse_fine(
            request.symptom_keywords,
            request.age,
            gender_num,
            bmi,
            request.chronic_diseases,
            request.medications
        )

        # ✅ 결과 반환
        return PredictResponse(
            coarseLabel=coarse,
            fineLabel=fine,
            riskScore=risk
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# -------------------------------
# 🏁 로컬 실행 엔트리포인트
# -------------------------------
if __name__ == "__main__":
    uvicorn.run("ai_server:app", host="0.0.0.0", port=8000, reload=True)
