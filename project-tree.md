📦 2025-1-comprehensive-project/
│
├── .env                        // 🔹 환경 변수 파일 (PORT, DATABASE_URL, FRONTEND_ORIGIN 등)
│
├── frontend/                  // 🔸 React Native Expo 기반 클라이언트
│   ├── app/                   // 🔹 Expo Router 기반 라우팅 디렉토리
│   │   ├── index.tsx             // 앱 최초 실행시 보여지는 인덱스 리다이렉트
│   │   ├── _layout.tsx          // 전체 앱 공통 레이아웃 (Tab & Stack 공유)
│   │   ├── (auth)/              // 🔐 인증 관련 화면들
│   │   │   ├── login.tsx           // 로그인 화면
│   │   │   ├── signup.tsx          // 회원가입 화면
│   │   │   ├── welcome.tsx          // 
│   │   │   └── profile-form.tsx    // 사용자 프로필 입력 폼 (최초 로그인 후)
│   │   ├── (record)/            // 📝 자가진단 관련 화면들
│   │   │   ├── symptom.tsx         // 증상 입력 화면
│   │   │   └── result.tsx          // AI 예측 결과 화면
│   │   ├── (tabs)/              // 📱 하단 탭 구조
│   │   │   ├── _layout.tsx         // 탭 전용 레이아웃
│   │   │   ├── home.tsx            // 홈 탭
│   │   │   ├── history.tsx         // 진단 기록 탭
│   │   │   └── setting.tsx         // 설정 탭
│   │   └── (user)/              // 👤 사용자 관련 추가 화면
│   │       └── profile-detail.tsx  // 사용자 프로필 상세 보기 및 수정 화면
│
│   ├── components/
│   │   ├── common/
│   │   │   ├── LogoutButton.tsx      //
│   │   │   └── BackButton.tsx        // 공통 뒤로가기 버튼 컴포넌트
│   │   └── modals/
│   │       ├── disease-select.modal.tsx    // 지병 선택 모달 (리스트에서 다중 선택)
│   │       └── medication-select.modal.tsx // 약물 선택 모달 (리스트에서 다중 선택)
│
│   ├── screens/
│   │   ├── (home)/
│   │   │   ├── SettingScreen.tsx         
│   │   │   └── HomeScreen.tsx              // 홈 화면 UI + 사용자 프로필 요약
│   │   ├── (record)/
│   │   │   ├── ResultScreen.tsx         
│   │   │   └── SymptomInputScreen.tsx         
│   │   └── (user)/
│   │       └── ProfileDetailScreen.tsx     // 프로필 수정 화면 (수정 가능)
│   ├── src/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts                // 로그인 상태 가져오는 커스텀 훅
│   │   │   └── useLLMExtract.ts          // 증상 텍스트 → 키워드 추출 훅
│   
│   │   ├── schemas/
│   │   │   ├── auth.schema.ts          // 
│   │   │   └── user.schema.ts          //
│   
│   │   ├── services/                   // 🔸 백엔드 API 요청 모듈
│   │   │   ├── axios.ts                   // axios 인스턴스 설정 (기본 URL 등)
│   │   │   ├── auth.api.ts               // 로그인, 회원가입 요청 처리
│   │   │   ├── user.api.ts               // 사용자 정보 수정, 조회
│   │   │   ├── disease.api.ts            // 지병 목록 GET
│   │   │   ├── medication.api.ts         // 약물 목록 GET
│   │   │   ├── llm.api.ts                // 증상 추출 LLM API
│   │   │   ├── prediction.api.ts         // 예측 결과 요청 API
│   │   │   └── record.api.ts             // 사용자 기록 API
│
│   │   ├── store/
│   │   │   └── auth.store.ts             // 로그인 사용자 상태 전역 관리 (Zustand)
│
│   │   ├── types/
│   │   │   ├── prediction.ts                //
│   │   │   ├── record.ts                //
│   │   │   ├── symptom.ts                //
│   │   │   └── user.ts                   // 사용자 타입 정의 (User, Profile 등)
│
│   │   └── utils/
│   │       ├── risk-utils.ts                // 
│   │       ├── gender.ts                // 성별 영어-한글 변환 유틸 함수
│   │       └── query-client.ts         // React Query 클라이언트 설정
│
│   └── app.config.ts                // Expo 앱 설정
│   └── tsconfig.json                // TypeScript 설정
│
├── backend/                   // 🔸 Node.js + Express + Prisma 기반 서버
│   ├── prisma/
│   │   ├── schema.prisma             // DB 모델 정의
│   │   └── seed.ts                   // 초기 데이터 삽입 (지병, 약물 등)
│
│   ├── src/
│   │   ├── config/
│   │   │   ├── cors.config.ts            // CORS 설정
│   │   │   └── prisma.service.ts         // Prisma 클라이언트 인스턴스
│
│   │   ├── controllers/               // REST API 엔드포인트 정의
│   │   │   ├── auth.controller.ts         // 로그인, 회원가입
│   │   │   ├── user.controller.ts         // 사용자 프로필 조회, 수정, 삭제
│   │   │   ├── disease.controller.ts      // 지병 목록
│   │   │   ├── medication.controller.ts   // 약물 목록
│   │   │   ├── llm.controller.ts          // 증상 추출 API
│   │   │   ├── prediction.controller.ts   // 질병 예측 결과
│   │   │   ├── record.controller.ts       // 사용자 기록
│   │   │   └── symptom.controller.ts      // 증상 입력/조회
│
│   │   ├── services/                  // 비즈니스 로직 (Controller → Service → DB)
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── disease.service.ts
│   │   │   ├── medication.service.ts
│   │   │   ├── llm.service.ts
│   │   │   ├── prediction.service.ts
│   │   │   ├── record.service.ts
│   │   │   └── symptom.service.ts
│
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts         // JWT 인증 미들웨어
│
│   │   ├── routes/                    // 라우팅 설정 (라우터 별로 분리)
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── disease.routes.ts
│   │   │   ├── medication.routes.ts
│   │   │   ├── llm.routes.ts
│   │   │   ├── prediction.routes.ts
│   │   │   ├── record.routes.ts
│   │   │   ├── symptom.routes.ts
│   │   │   └── index.ts                  // 전체 API 경로 통합
│
│   │   ├── schemas/
│   │   │   └── user.schema.ts            // 사용자 입력 유효성 검증 (zod)
│
│   │   ├── utils/
│   │   │   ├── axios.ts               // JWT 토큰 생성/검증
│   │   │   ├── jwt.util.ts               // JWT 토큰 생성/검증
│   │   │   ├── getKoreanLabels.ts        // 예측 라벨 → 한글 변환
│   │   │   ├── normalizeSymptom.ts       // 증상 전처리
│   │   │   ├── symptomLabel.ko.ts        // 라벨 목록
│   │   │   └── symptomMap.ts             // 증상 매핑 테이블
│
│   │   ├── types/
│   │   │   └── prediction.ts
│   │
│   └── types/
│       └── express/
│           └── index.d.ts            // Express 확장 타입 (req.user 등)
│
│   └── server.ts                      // 서버 진입점 (Express 실행)
