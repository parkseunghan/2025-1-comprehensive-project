# 🤖 AI 기반 내과 질병 예측 모델

이 디렉토리는 증상 키워드와 사용자 정보를 바탕으로  
내과 질환을 예측하는 **AI 모델 학습 및 추론 코드**를 포함하고 있습니다.

---

## 📁 디렉토리 구성

| 경로 | 설명 |
|------|------|
| `scripts/embed_sbert_features.py` | SBERT 임베딩 벡터 생성 |
| `scripts/train_coarse_model.py`  | coarse(질병군) 분류 모델 학습 |
| `scripts/train_fine_models.py`   | fine(세부 질병) 분류 모델 학습 |
| `scripts/predict_disease.py`     | 통합 추론 함수 정의 |
| `scripts/extract_symptom_keywords.py` | 증상 키워드 기반 symptom_map 생성 |
| `scripts/save_artifacts.py` | 모델 부속 객체 저장 (인코더 등) |
| `scripts/model_util.py` | 예측 로직 유틸리티 함수 모음 |
| `predict_demo.py`                | 샘플 기반 예측 실행 |
| `main.py`                        | 전체 학습 + 예측 파이프라인 실행 |
| `ai_server.py`                   | FastAPI 기반 예측 API 서버 |
| `models/`                        | 학습된 모델 및 인코더 저장 |
| `data/`                          | 학습용 CSV 및 설정 파일 보관 |

---

## 🔍 예측 구조

              사용자 입력
        (증상 키워드 + 신체 정보)  
                  ↓  
     SBERT 임베딩 + MLP 피처 결합  
                  ↓  
          [coarse 분류 모델]  
    감기 / 감염 / 소화기 / 호흡기 / 심혈관  
                  ↓  
         [fine 분류 모델 분기]  
                  ↓  
     🎯 Top-3 질병 예측 + 위험도 산출



---

## ⚙️ 실행 방법

### 0. 가상환경

```bash
# Python 3.9.11 설치 후
python3.9 -m venv venv
source venv/bin/activate  # 윈도우는 venv\Scripts\activate
```

### 1. 라이브러리 설치

```bash
pip install -r requirements.txt # 오래걸림
```
### 2. SBERT 임베딩 생성
```
python scripts/embed_sbert_features.py
```

### 3. 모델 학습
```
python scripts/train_coarse_model.py
python scripts/train_fine_models.py
```

### 4. 예측 테스트 (로컬 실행)
```
python main.py
```

### 5. 예측 테스트 (데모 실행)
```
python predict_demo.py
```


---

## 예측 결과 예시 (JSON)
```json
{
  "coarse_label": "호흡기",
  "top_predictions": [
    { "label": "폐렴", "prob": 0.912 },
    { "label": "천식", "prob": 0.063 },
    { "label": "COPD", "prob": 0.018 }
  ],
  "risk_score": 3.4,
  "risk_level": "높음",
  "recommendation": "빠른 병원 방문이 필요합니다."
}
```

---

## 📌 사용 모델
- SBERT: snunlp/KR-SBERT-V40K-klueNLI-augSTS
- Coarse 분류: BERT 임베딩 + MLP 하이브리드
- Fine 분류: 그룹별 개별 MLP + Focal Loss 일부 적용
- 위험도 계산: 나이, BMI, 지병, 약물 등 고려한 커스텀 가중치 함수
---

## 📂 주요 파일 설명

### 파일 역할
| 경로 | 설명 |
|------|------|
| `ai_server.py` | SFastAPI 기반 추론 API 서버 (/predict) |
| `main.py`  | 	전체 파이프라인 일괄 실행용 |
| `predict_demo.py`   | 샘플 예측 결과 확인용 스크립트 |
| `scripts/model_util.py`     | 	`predict_coarse_fine()` 포함 핵심 예측 함수 |
| `scripts/save_artifacts.py` | 	scaler, 인코더 등 부속 모델 저장용 |
| `scripts/extract_symptom_keywords.py` | 질병별 증상 키워드 맵 추출 JSON 생성 |

---
### 디렉토리 구조
```
ai/
├── ai_server.py                  # FastAPI 기반 AI 예측 서버 진입점
├── main.py                       # 로컬 예측 테스트용 실행 파일
├── predict_demo.py              # 예측 결과 시각화 데모 실행용
├── README.md
├── requirements.txt             # Python 의존성 목록
├── start.sh                     # 서버 실행 쉘 스크립트
├── __pycache__/
├── venv/

├── data/
│   ├── processed/
│   │   ├── leaned_sbert_text_features_final.npy  # 전처리된 SBERT 임베딩 벡터
│   │   └── symptom_map.json                      # 증상 맵핑 테이블 (ID ↔ 텍스트)
│   └── raw/
│       ├── leaned_train_dataset.csv              # 원본 학습 데이터셋
│       └── fine_config.json                      # fine 모델 구성 정보 (coarse별 분류 세트)

├── models/
│   └── fine/
│       ├── coarse_label_encoder.pkl              # coarse 라벨 인코더
│       ├── mlb_chronic.pkl / mlb_meds.pkl        # 다중 라벨 바이너리 인코더 (지병, 약물)
│       ├── model_coarse.h5                       # coarse 분류 모델 파일 (Keras)
│       └── scaler.pkl                            # 입력 피처 정규화용 스케일러

├── scripts/
│   ├── embed_sbert_features.py                  # SBERT 임베딩 추출
│   ├── extract_symptom_keywords.py              # 증상 키워드 정제 스크립트
│   ├── model_util.py                            # 모델 공통 유틸 함수들
│   ├── predict_disease.py                       # 모델 추론 테스트용 스크립트
│   ├── save_artifacts.py                        # 모델 및 인코더 저장
│   ├── train_coarse_model.py                    # coarse 모델 학습
│   └── train_fine_models.py                     # coarse 그룹별 fine 모델 학습
```

---

## 📚 데이터 출처

본 프로젝트에서 사용된 질병 및 증상 관련 데이터는 다음의 **Kaggle 공개 데이터셋**들을 기반으로 가공 및 재구성되었으며, **연구 및 교육 목적**으로만 활용됩니다

> ⚠️ **주의사항**  
> 모든 데이터는 **의료 전문가의 진단을 대체할 수 없으며**, 실제 의료 목적이 아닌 **연구 및 학습 목적**으로만 사용되어야 합니다. 각 데이터셋의 원 저작자와 라이선스 조건을 반드시 준수해야 합니다.


### 1. [Disease Symptom Description Dataset](https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset)
- **Author**: *Itachi9604*  
- **Description**: 질병별 주요 증상, 설명(description), 예방 팁(tips)을 포함한 상세 데이터셋  
- **License**: Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)  
- **Note**: 비상업적 용도로만 사용 가능. 의료적 진단을 대체하지 않음


### 2. [Disease Symptom Prediction Dataset](https://www.kaggle.com/datasets/karthikudyawar/disease-symptom-prediction)
- **Author**: *Karthik Udyawar*  
- **Description**: 질병에 따른 증상 매핑을 포함한 예측용 데이터셋 (multi-class 분류에 적합)  
- **License**: 공개 (공식 라이선스 명시 없음)  
- **Note**: 증상 기반 질병 예측 모델링에 유용


### 3. [Disease, Symptoms and Patient Profile Dataset](https://www.kaggle.com/datasets/uom190346a/disease-symptoms-and-patient-profile-dataset)
- **Author**: *Mubeen Shakir (uom190346a)*  
- **Description**: 질병, 증상, 환자 프로필(나이, 성별, 직업 등) 포함한 복합 데이터셋  
- **License**: 공개 (공식 라이선스 명시 없음)  
- **Note**: 사용자 기반 맞춤형 예측 모델 개발에 참고


### 4. [Disease Prediction Using Machine Learning](https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning)
- **Author**: *Kaushil Shah*  
- **Description**: 다양한 증상 기반 질병 예측용 데이터셋, 머신러닝 학습용으로 정제됨  
- **License**: 공개 (공식 라이선스 명시 없음)  
- **Note**: 증상-질병 매트릭스를 기반으로 한 다중 분류 예측에 활용 가능

---
## ⚠️ 주의사항
- 본 모델은 의학적 참고용으로, 실제 진단을 대체하지 않습니다.
- 지속적이거나 심각한 증상이 있는 경우 반드시 의료 전문가의 진료를 받으세요.
