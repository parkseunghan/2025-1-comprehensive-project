# 2025-1 종합프로젝트

## 프로젝트명: AI 진단 도우미 (AI 기반 자가 진단 서비스 - SmartHealth: AI Self-Diagnosis System)

AI 모델을 기반으로 사용자 증상을 입력 받아 질병을 예측하고, 건강 기록을 관리하는 자가진단 모바일 앱입니다.

## 🔧 기술 스택

### 프론트엔드
- React Native (Expo Router)
- TypeScript
- Zustand (전역 상태 관리)
- Axios / React Query
- Tailwind + NativeWind

### 백엔드
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT (인증)
- Zod (입력값 검증)
- RESTful API

    - nodejs
    - ES Module 사용

    npm install
    - nodemon: 코드 변경 시 자동 재실행
    - express: 백엔드 프레임워크
    - cors: CORS 정책 허용
    - dotenv: 환경변수 관리
    - pg, sequelize, sequelize-cli: PostgreSQL 연동
    - body-parser: JSON 요청 처리
    - multer: 파일 업로드(음성 데이터 저장)
   
### Database
    - postgreSQL

### AI 모델
- Mistral 기반 증상 키워드 추출 (LLM)
- Coarse-to-fine 분류 구조 (BERT + MLP 하이브리드)
- 예측 결과 + 가이드라인 제공


## 🌐 주요 기능

- [x] 로그인 / 회원가입
- [x] 사용자 프로필 입력 (성별, 나이, 키, 몸무게, 질병, 약물)
- [x] LLM 기반 증상 키워드 추출 (Ollama + mistral)
- [x] AI 질병 예측 (BERT + MLP 모델)
- [x] 예측 결과 & 가이드라인 제공
- [x] 진단 기록 저장 / 이력 조회
- [x] 프로필 수정 기능


## 📦 환경 변수 (.env 예시)

루트 디렉토리에 `.env` 파일을 추가해야 합니다.

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_diagnosis
FRONTEND_ORIGIN=http://localhost:8081
BACKEND_PORT=5000
JWT_SECRET=super-secret-key
```

