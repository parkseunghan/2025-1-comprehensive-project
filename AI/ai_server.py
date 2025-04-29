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
        # allow_population_by_field_name = True
        validate_by_name = True
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
        print("🟥 [AI 서버] 예측 요청 수신됨")
        print("📥 요청 데이터:", request.model_dump())
        print(f"➡️ symptom_keywords: {request.symptom_keywords}")
        print(f"➡️ age: {request.age}, gender: {request.gender}, height: {request.height}, weight: {request.weight}")
        print(f"➡️ diseases: {request.chronic_diseases}")
        print(f"➡️ medications: {request.medications}")
        print(f"➡️ bmi(from client): {request.bmi:.3f}")


        # 1. BMI 계산
        # height_m = request.height / 100
        # bmi = request.weight / (height_m ** 2)
        gender = 0 if request.gender == "남성" else 1
        print(f"👨‍⚕️ gender 변환값: {gender} (0=남성, 1=여성)")

        result = predict_coarse_fine(
            symptom_keywords=request.symptom_keywords,
            age=request.age,
            gender=gender,
            height=request.height,
            weight=request.weight,
            bmi=request.bmi,
            diseases=request.chronic_diseases,
            medications=request.medications
        )

        print("🟩 [AI 서버] 예측 결과 반환:", result)

        return result  # {'predictions': [...]} 형태

    except Exception as e:
        print("❌ [AI 서버] 예측 중 오류:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 서버 실행
if __name__ == "__main__":
    uvicorn.run("ai_server:app", host="0.0.0.0", port=8000, reload=True)
