# 활용 API

## 데이터 출처

이 저장소의 질병/약물 관련 데이터는 다음의 공공 Open API로부터 수집되었습니다:

- [식품의약품안전처 의약품 개요정보 서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15075057)
- [건강보험심사평가원 질병정보서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15119055)

해당 데이터는 공공데이터포털의 '공공저작물 출처표시' 조건에 따라 자유롭게 활용 가능합니다.

## 약물

API 이름: 의약품 개요정보(e약은요) 서비스 v1.0
API 제공처: 식품의약품안전처 / 공공데이터포털
API 유형: OpenAPI (RESTful)
API URL: https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList
총 수집된 의약품 수: 4,813건

backend/
├── data/
│   ├── medications.json      # ✅ 전체 수집된 약물 정보
│   ├── failures.json         # ❌ 요청 실패한 페이지 번호 목록 (있을 경우)
│   └── progress.json         # 📌 마지막 요청 페이지 번호 저장
├── utils/
│   └── public-api.ts         # ✅ 공공API 인스턴스
├── scripts/
│   └── fetchAllMedications.ts         # ✅ 전체 약물 정보 수집 스크립트


## 질병

API 이름: 건강보험심사평가원_질병정보서비스
API 제공처: 건강보험심사평가원 / 공공데이터포털
API 유형: OpenAPI (RESTful)
API URL: https://apis.data.go.kr/B551182/diseaseInfoService1/getDissNameCodeList1
총 수집된 질병 수: 2,065건 

backend/
├── data/
│   ├── diseases.json               # ✅ 전체 수집된 질병 코드/이름 정보
│   ├── diseases_failures.json      # ❌ 요청 실패한 페이지 번호 목록 (있을 경우)
│   └── diseases_progress.json      # 📌 마지막 요청 페이지 번호 저장
├── scripts/
│   └── fetchAllDiseases.ts        # ✅ 전체 질병 코드 정보 수집 스크립트


## 스크립트 실행

```js
cd backend

npx ts-node scripts/fetchAllMedications.ts
npx ts-node scripts/fetchAllDiseases.ts
```



```
backend/
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── server.ts
├── tsconfig.json

├── data/
│   ├── diseases.json
│   ├── medications.json
│   └── symptoms.json

├── dist/

├── guide/

├── node_modules/

├── prisma/
│   ├── migrations/
│   ├── disease_descriptions.json
│   ├── schema.prisma
│   └── seed.ts

├── scripts/
│   ├── fetchAllDiseases.ts
│   ├── fetchAllMedications.ts
│   ├── insertDiseases.ts
│   ├── insertMedications.ts
│   └── insertSymptoms.ts

├── src/
│   ├── config/
│   │   ├── cors.config.ts
│   │   └── prisma.service.ts

│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── disease.controller.ts
│   │   ├── extract.controller.ts
│   │   ├── llm.controller.ts
│   │   ├── medication.controller.ts
│   │   ├── prediction.controller.ts
│   │   ├── record.controller.ts
│   │   ├── symptom.controller.ts
│   │   └── user.controller.ts

│   ├── middlewares/
│   │   └── auth.middleware.ts

│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── disease.routes.ts
│   │   ├── extract.routes.ts
│   │   ├── index.ts
│   │   ├── llm.routes.ts
│   │   ├── medication.routes.ts
│   │   ├── prediction.routes.ts
│   │   ├── record.routes.ts
│   │   ├── symptom.routes.ts
│   │   └── user.routes.ts

│   ├── schemas/
│   │   └── user.schema.ts

│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── disease.service.ts
│   │   ├── extract.service.ts
│   │   ├── llm.service.ts
│   │   ├── medication.service.ts
│   │   ├── prediction.service.ts
│   │   ├── record.service.ts
│   │   ├── symptom.service.ts
│   │   └── user.service.ts

│   ├── types/
│   │   └── prediction.types.ts
│   └── utils/
│       ├── ai-api.ts
│       ├── extract-api.ts
│       ├── getKoreanLabels.ts
│       ├── jwt.util.ts
│       ├── normalizeSymptoms.ts
│       ├── public-api.ts
│       ├── symptomLabel.ko.ts
│       └── symptomMap.ts

├── types/
│   └── express/
│       └── index.d.ts
```

- `/src/config`: Prisma 및 CORS 관련 설정 파일
- `/src/controllers`: 각 API 요청에 대한 컨트롤러 레이어 (라우터에서 호출)
- `/src/middlewares`: JWT 인증 처리 미들웨어
- `/src/routes`: RESTful API 라우팅 정의
- `/src/schemas`: zod 기반 입력 유효성 검사 스키마
- `/src/services`: 비즈니스 로직 처리 레이어 (DB 처리 포함)
- `/src/utils`: 공통 유틸리티 함수 모음
- `/src/types`: TypeScript 타입 정의 모음
- `/scripts`: 공공 API 수집 및 DB 삽입 스크립트
- `/prisma`: Prisma 모델 및 초기 데이터 관리

예시:

- `controllers/prediction.controller.ts`: 예측 결과 저장, 조회를 담당
- `services/llm.service.ts`: LLM 정제 API 연동 및 처리 로직
- `routes/record.routes.ts`: /records 엔드포인트 라우팅
```
