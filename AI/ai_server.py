# 📄 ai_server.py
# FastAPI 기반 AI 예측 서버
# SBERT 기반 유사도 검색 + coarse/fine 모델 분기 실행

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from typing import Optional
import uvicorn

from scripts.model_util import predict_coarse_fine  # ✅ 예측 함수 import

app = FastAPI()

# ✅ 요청 데이터 스키마
class PredictRequest(BaseModel):
    gender: str
    age: int
    height: int
    weight: int
    chronic_diseases: List[str]
    medications: List[str]
    symptom_keywords: List[str]

# ✅ 응답 데이터 스키마
class PredictionItem(BaseModel):
    coarseLabel: str
    fineLabel: Optional[str]
    riskScore: float

class PredictResponse(BaseModel):
    predictions: List[PredictionItem]

# ✅ 예측 API
@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        # 1. BMI 계산
        height_m = request.height / 100
        bmi = request.weight / (height_m ** 2)

        # 2. 성별 인코딩
        gender = 0 if request.gender == "남성" else 1

        # 3. 예측 실행
        result = predict_coarse_fine(
            symptom_keywords=request.symptom_keywords,
            age=request.age,
            gender=gender,
            bmi=bmi,
            diseases=request.chronic_diseases,
            medications=request.medications
        )

        return result  # {'predictions': [...]} 형태

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ 서버 실행
if __name__ == "__main__":
    uvicorn.run("ai_server:app", host="0.0.0.0", port=8000, reload=True)
