## 📁 파일 및 코드 스타일 가이드

### ✅ 파일 작명법
- **도메인.역할.ts** 형식을 사용합니다.
- 예시:
  - `user.controller.ts`
  - `disease.service.ts`
  - `record.routes.ts`

### ✅ 코드 구조 및 작성 방식
- **TypeScript + Express 함수형 구조**를 기본으로 사용합니다.
- `class`를 지양하고, `함수형 선언`을 기본으로 합니다.
- 비즈니스 로직은 controller → service → mock/db로 흐릅니다.

### ✅ 폴더 구조 (Service Layered MVC)
```
/src
  ├── controllers/       # API 요청 처리, 서비스 호출
  ├── services/          # 비즈니스 로직
  ├── routes/            # API 경로 및 메서드 정의
  ├── models/            # (추후) Prisma 모델
  ├── mock/              # 더미 데이터 모듈
  └── server.ts          # 서버 진입점
```

### ✅ 코드 주석 규칙 (3단 설명 주석)
1. **파일 상단 주석**
```ts
// 🔹 user.controller.ts
// 이 파일은 사용자(User) API 요청을 처리하는 컨트롤러입니다.
```

2. **함수별 JSDoc 주석**
```ts
/**
 * 사용자 ID로 사용자 정보를 조회합니다.
 */
```

3. **주요 코드 라인 주석**
```ts
const user = userService.findById(req.params.id); // 사용자 찾기
```

### ✅ REST API 경로 설계 규칙
- 도메인 단위 RESTful 설계를 따릅니다.
- 예시:
  - `GET /api/users/:id`
  - `POST /api/diseases/user/:userId`
  - `POST /api/predictions/symptom-records/:recordId/prediction`

### ✅ 기타
- 모든 요청은 `express.json()` 기반 JSON 요청 처리
- 예측 API는 향후 AI 모델 연동을 고려한 구조로 작성
- 모든 서비스 계층은 `mock/` 데이터로 처리 후 DB로 전환 예정
