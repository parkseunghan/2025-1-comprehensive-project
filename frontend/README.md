# Expo Router Example

Use [`expo-router`](https://docs.expo.dev/router/introduction/) to build native navigation using files in the `app/` directory.

## 🚀 How to use

```sh
npx create-expo-app -e with-router
```

## 📝 Notes

- [Expo Router: Docs](https://docs.expo.dev/router/introduction/)


```
frontend/
├── .expo/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── profile-form.tsx
│   │   ├── signup.tsx
│   │   └── welcome.tsx
│   ├── (dictionary)/
│   │   └── disease.tsx
│   ├── (record)/
│   │   ├── result.tsx
│   │   ├── symptomchoice.tsx
│   │   ├── symptominput.tsx
│   │   ├── symptomlistselect.tsx
│   │   └── symptomtextinput.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── history.tsx
│   │   ├── home.tsx
│   │   └── setting.tsx
│   ├── (user)/
│   │   └── profile-detail.tsx
│   ├── _layout.tsx
│   └── index.tsx

├── assets/
│   └── images/
│       └── AJINGA_LOGO.png

├── components/
│   ├── common/
│   │   ├── BackButton.tsx
│   │   └── LogoutButton.tsx
│   └── modals/
│       ├── disease-select.modal.tsx
│       └── medication-select.modal.tsx

├── node_modules/

├── screens/
│   ├── (auth)/
│   │   └── ProfileFormScreen.tsx
│   ├── (dictionary)/
│   │   └── DiseaseScreen.tsx
│   ├── (home)/
│   │   ├── HomeScreen.tsx
│   │   └── SettingScreen.tsx
│   ├── (record)/
│   │   ├── ResultScreen.tsx
│   │   ├── SymptomChoiceScreen.tsx
│   │   ├── SymptomInputScreen.tsx
│   │   ├── SymptomListSelectScreen.tsx
│   │   └── SymptomTextInputScreen.tsx
│   └── (user)/
│       └── ProfileDetailScreen.tsx

├── src/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useLLMExtract.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   └── user.schema.ts
│   ├── services/
│   │   ├── auth.api.ts
│   │   ├── axios.ts
│   │   ├── disease.api.ts
│   │   ├── llm.api.ts
│   │   ├── medication.api.ts
│   │   ├── prediction.api.ts
│   │   ├── record.api.ts
│   │   └── user.api.ts
│   ├── store/
│   │   └── auth.store.ts
│   ├── types/
│   │   ├── disease.types.ts
│   │   ├── medication.types.ts
│   │   ├── prediction.types.ts
│   │   ├── record.types.ts
│   │   ├── symptom.types.ts
│   │   └── user.types.ts
│   └── utils/
│       ├── gender.ts
│       ├── query-client.ts
│       └── risk-utils.ts

├── app.config.ts
├── app.json
├── Dockerfile
├── metro.config.js
├── package-lock.json
├── package.json
├── tsconfig.json
├── README.md
```

- `/app`: Expo Router 기반 화면 라우팅 디렉토리 (파일명 기반 URL 매핑)
- `/screens`: 실제 화면 구성 및 UI 정의
- `/components`: 공통 UI 컴포넌트 (예: 버튼, 모달)
- `/src/hooks`: 커스텀 훅 정의 (예: useAuth, useLLMExtract)
- `/src/services`: 백엔드 API 요청을 담당하는 axios 모듈들
- `/src/store`: 상태 관리 저장소 (Zustand)
- `/src/schemas`: 프론트 유효성 검사 스키마 (Zod)
- `/src/types`: API 응답/요청 타입 정의
- `/src/utils`: 공통 유틸 함수들

예시:

- `screens/(record)/SymptomInputScreen.tsx`: 증상 입력 UI
- `components/modals/disease-select.modal.tsx`: 지병 선택 모달
- `services/llm.api.ts`: 정제된 문장 요청 API
- `utils/query-client.ts`: React Query 클라이언트 인스턴스
```
