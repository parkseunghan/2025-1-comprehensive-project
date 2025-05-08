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