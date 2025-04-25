# 📄 ai_server.py
# FastAPI 기반 AI 예측 서버
# SBERT 기반 유사도 검색 + coarse/fine 모델 분기 실행

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn

from scripts.model_util import predict_coarse_fine

app = FastAPI()

# ✅ 요청 데이터 스키마
# ✅ 요청 데이터 모델 (camelCase alias 설정)
class PredictRequest(BaseModel):
    gender: str = Field(..., alias="gender")
    age: int = Field(..., alias="age")
    height: float = Field(..., alias="height")
    weight: float = Field(..., alias="weight")
    bmi: float = Field(..., alias="bmi")
    chronic_diseases: List[str] = Field(..., alias="chronicDiseases")
    medications: List[str] = Field(..., alias="medications")
    symptom_keywords: List[str] = Field(..., alias="symptomKeywords")

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True

# ✅ 응답 스키마
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
        print("🟥 AI 서버 예측 요청 수신:", request.model_dump())

        # 1. BMI 계산
        height_m = request.height / 100
        bmi = request.weight / (height_m ** 2)
        gender = 0 if request.gender == "남성" else 1

        result = predict_coarse_fine(
            symptom_keywords=request.symptom_keywords,
            age=request.age,
            gender=gender,
            height=request.height,
            weight=request.weight,
            bmi=bmi,
            diseases=request.chronic_diseases,
            medications=request.medications
        )

        print("🟩 예측 결과 반환:", result)
        return result  # {'predictions': [...]} 형태

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 서버 실행
if __name__ == "__main__":
    uvicorn.run("ai_server:app", host="0.0.0.0", port=8000, reload=True)
