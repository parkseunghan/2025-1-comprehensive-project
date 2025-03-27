# 📘 AI 자가진단 서비스 API 명세서

---

## 🔐 1. 인증/회원

| Method | Endpoint       | 설명                        |
|--------|----------------|-----------------------------|
| POST   | /auth/signup   | 회원가입                   |
| POST   | /auth/login    | 로그인 후 JWT 발급         |
| GET    | /auth/me       | 로그인된 사용자 정보 확인   |

---

## 👤 2. 사용자 (User)

| Method | Endpoint        | 설명                        |
|--------|-----------------|-----------------------------|
| GET    | /users/:id      | 사용자 단일 조회            |
| PUT    | /users/:id      | 사용자 정보 수정            |
| DELETE | /users/:id      | 사용자 삭제 (탈퇴)          |

---

## 💊 3. 지병 (Disease)

### 📚 질병 사전

| Method | Endpoint         | 설명                          |
|--------|------------------|-------------------------------|
| GET    | /diseases        | 질병 목록 검색 (`?q=검색어`) |
| GET    | /diseases/:id    | 특정 질병 정보 조회           |

### 👤 사용자 지병

| Method | Endpoint                             | 설명                      |
|--------|--------------------------------------|---------------------------|
| POST   | /users/:userId/diseases              | 사용자 지병 추가          |
| GET    | /users/:userId/diseases              | 사용자 지병 목록 조회     |
| DELETE | /users/:userId/diseases/:diseaseId   | 사용자 지병 제거          |

---

## 🤒 4. 증상 (Symptom)

| Method | Endpoint         | 설명                          |
|--------|------------------|-------------------------------|
| GET    | /symptoms        | 증상 목록 검색 (`?q=검색어`) |
| GET    | /symptoms/:id    | 특정 증상 정보 조회           |

---

## 📋 5. 증상 기록 (SymptomRecord)

| Method | Endpoint                              | 설명                            |
|--------|---------------------------------------|---------------------------------|
| POST   | /users/:userId/symptom-records        | 증상 기록 생성                  |
| GET    | /users/:userId/symptom-records        | 사용자 증상 기록 목록 조회      |
| GET    | /symptom-records/:id                  | 특정 증상 기록 조회             |
| DELETE | /symptom-records/:id                  | 증상 기록 삭제                  |

---

## ⚙️ 6. 증상 기록 ↔ 증상 (SymptomOnRecord)

| Method | Endpoint                                               | 설명                    |
|--------|--------------------------------------------------------|-------------------------|
| POST   | /symptom-records/:recordId/symptoms                    | 증상 기록에 증상 추가   |
| DELETE | /symptom-records/:recordId/symptoms/:symptomId         | 증상 기록에서 증상 제거 |

---

## 🧠 7. 예측 (Prediction)

| Method | Endpoint                                      | 설명                             |
|--------|-----------------------------------------------|----------------------------------|
| POST   | /symptom-records/:recordId/prediction         | 예측 생성 (AI 결과 저장)        |
| GET    | /symptom-records/:recordId/prediction         | 예측 결과 조회                   |

---

## 📌 예시 JSON

### ▶ POST /users/:id/diseases

```json
{
  "diseaseId": "clxyz123d0003"
}
```

### ▶ POST /symptom-records

```json
{
  "symptomIds": ["clsym001", "clsym002"]
}
```

### ▶ GET /symptom-records/:id/prediction

```json
{
  "result": "독감",
  "confidence": 0.93,
  "guideline": "수분 섭취 및 휴식, 필요 시 병원 내원",
  "createdAt": "2025-03-27T13:22:00Z"
}
```
