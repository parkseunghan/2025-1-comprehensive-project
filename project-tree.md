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