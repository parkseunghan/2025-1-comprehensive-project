# 설명
NLP기반 증상 추출 API 서버

# ⚙️ 실행 방법

```py
# (선택)기존 라이브러리 제거
pip freeze > old.txt
pip uninstall -y -r old.txt
```

## 0. 가상환경

```sh
# python 3.9.11 설치 후
py -3.9 -m venv venv # 가상환경 생성

source venv/Scripts/activate # 가상환경 실행
```

## 1. 라이브러리 설치

```bash
pip install -r requirements.txt # 오래걸림
```



# 폴더 구조
## 📁 extract (Python 기반 증상 추출 API)

extract/
├── app.py                          # FastAPI 엔트리포인트
├── requirements.txt               # 의존성 파일
│
├── services/                      # 주요 기능 로직
│   ├── translator_service.py     # 구글 번역 API 로직
│   └── symptom_service.py        # 증상 추출 메인 로직 (매핑 기반)
│
├── utils/                         # 공통 유틸
│   ├── text_cleaner.py           # 이모지 제거, 공백 정리 등 전처리
│   └── symptom_mapping.py        # 증상 매핑 테이블 (SYMPTOM_MAPPING 포함)
│
├── models/
│   └── request_model.py          # Pydantic Request 모델 정의



# 🔧 전체 처리 흐름
1. 입력 처리
사용자로부터 한글 문장 입력받음 (예: "어제부터 배가 아프고 기침이 나요")

2. 전처리
utils/text_cleaner.py: 이모지 제거 등 텍스트 정제

3. 병렬 증상 추출
services/symptom_service.py에서:

한글 문장에서 직접 증상 추출 (ex: "기침", "배가 아픔")

영어로 번역 후 영어 문장에서 증상 추출 (ex: "cough", "stomach ache")

4. 매핑 및 병합
영어 증상을 미리 정의된 eng_to_kor_symptom_map 테이블로 한글 증상으로 변환

한글로 추출된 증상과 영어 매핑 후 증상을 병합하고 중복 제거

5. 시간 정보 추출
각 증상과 매핑되는 시간 정보 추출 (예: "night", 없으면 null)

6. 응답 구성
```json
{
  "original": "어제부터 배가 아프고 기침이 나요",
  "translated": "My stomach hurts and I am coughing since yesterday",
  "results": [
    {"symptom": "기침", "time": "night"},
    {"symptom": "복통", "time": null}
  ]
}
```


```
extract/
├── server.py                         # FastAPI 기반 증상 추출 서버 진입점
├── start.sh                          # 서버 실행용 쉘 스크립트
├── requirements.txt                  # Python 의존성 목록
├── README.md
├── __pycache__/
├── venv/

├── models/
│   └── request_model.py              # 입력 요청(Request)용 pydantic 모델 정의

├── services/
│   ├── symptom_service.py            # 증상 추출 핵심 로직 (토큰 기반 추출 포함)
│   └── translator_service.py         # Googletrans 기반 한↔영 번역 서비스

├── utils/
│   ├── korean_rules.py               # 한국어 특수 규칙 정의 (예: 조사 제거)
│   ├── symptom_mapping.py            # 증상 매핑 테이블 (영문/한글 표현 대응)
│   └── text_cleaner.py               # 텍스트 전처리 함수 모음 (이모지 제거 등)
```


