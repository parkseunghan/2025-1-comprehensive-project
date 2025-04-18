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
| `predict_demo.py`                | 샘플 기반 예측 실행 |
| `models/`                        | 학습된 모델 및 인코더 저장 |
| `data/`                          | 학습용 CSV 및 설정 파일 보관 |

---

### 🔍 예측 
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

### 1. 라이브러리 설치

```bash
pip install -r requirements.txt
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

### 4. 예측 실행
```
python predict_demo.py
```

---

## 🔍 예측 결과 예시
- 🎯 **Top-3 예측 질병**
  1. 폐렴 (91.2%)
  2. 천식 (6.3%)
  3. COPD (1.8%)

- 📊 **위험도 점수**: 3.4 / **높음**
- 💡 **가이드라인**: 빠른 병원 방문이 필요합니다.

---

## 📌 사용 모델
- SBERT: snunlp/KR-SBERT-V40K-klueNLI-augSTS
- MLP 기반 분류기 (수치/범주형 피처)
- Focal Loss 적용 (fine 분류 모델 일부)
---

## 📂 주요 파일 설명

### 파일 역할
- models/	.h5 모델과 .pkl 인코더 저장
- data/raw/	원본 학습 데이터 CSV
-  data/processed/	SBERT 임베딩 .npy
- data/fine_config.json	fine 모델 학습 설정 파일
---
## ⚠️ 주의사항
- 본 모델은 의학적 참고용으로, 실제 진단을 대체하지 않습니다.
- 지속적이거나 심각한 증상이 있는 경우 반드시 의료 전문가의 진료를 받으세요.