📦 root/
├── 📦 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   ├── 📁 routes/
│   │   ├── 📁 services/
│   │   ├── 📁 models/
│   │   ├── 📁 middlewares/
│   │   ├── 📁 config/
│   │   ├── 📁 utils/
│   │   ├── 📁 mock/                 # ✅ 더미 데이터 위치
│   │   │   ├── users.ts
│   │   │   ├── diseases.ts
│   │   │   ├── userDiseases.ts
│   │   │   ├── symptoms.ts
│   │   │   ├── symptomRecords.ts
│   │   │   ├── symptomOnRecords.ts
│   │   │   └── predictions.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── 📁 prisma/
│       └── schema.prisma
│   
├── 📦 frontend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   ├── 📁 routes/
│   │   ├── 📁 services/
│   │   ├── 📁 models/
│   │   ├── 📁 middlewares/
│   │   ├── 📁 config/
│   │   ├── 📁 utils/
│   │   ├── 📁 mock/                 # ✅ 더미 데이터 위치
│   │   │   ├── users.ts
│   │   │   ├── diseases.ts
│   │   │   ├── userDiseases.ts
│   │   │   ├── symptoms.ts
│   │   │   ├── symptomRecords.ts
│   │   │   ├── symptomOnRecords.ts
│   │   │   └── predictions.ts
│   │   └── server.ts
│   ├── 📄 .env                      # ✅ 루트에 위치함
│   ├── package.json
│   ├── tsconfig.json
│   └── 📁 prisma/
|       └── schema.prisma
|
├── 📦 ai-model/
├── 📦 database/
│   └── 📄 init.sql
├── 📄 .env

# auth API
📦 backend/src/
├── 📁 controllers/
│   └── authController.ts         # ✅ (추가) 회원가입, 로그인 처리
├── 📁 routes/
│   └── authRoutes.ts             # ✅ (추가) 인증 라우트 정의
├── 📁 services/
│   └── authService.ts            # ✅ (추가) 인증 로직 처리
├── 📁 middlewares/
│   └── authMiddleware.ts         # ✅ (추가) JWT 검증 미들웨어
├── 📁 utils/
│   └── jwt.ts                    # ✅ (추가) JWT 생성 및 검증 헬퍼
└── server.ts                     # ✅ 라우트 연결 (기존 파일)
