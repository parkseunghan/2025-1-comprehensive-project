# 백엔드
    - 프론트 연동
    - 리프레시 토큰
    - role 기반 미들웨어 설계 및 도입(관리자)

## ✅ 백엔드 기능 확장 To-Do 리스트

### 🥇 1순위 - 사용자 편의 및 필수 기능
- [ ] [GET] `/users/me` - 로그인한 사용자 정보 자동 조회
- [ ] [GET] `/symptoms?query=` - 증상 검색 / 자동완성 기능
- [ ] [POST] `/symptoms` - 사전 증상 추가 (관리자용)
- [ ] [PUT] `/symptom-records/:id` - 증상 기록 수정 기능
- [ ] [GET] `/users/:userId/predictions/statistics` - 사용자 예측 통계 분석

---

### 🥈 2순위 - 사용자 계정 관련
- [ ] [PUT] `/users/:id/password` - 비밀번호 변경
- [ ] [GET] `/auth/check-email?email=` - 이메일 중복 확인
- [ ] [DELETE] `/users/:id` - 사용자 탈퇴 처리
- [ ] [PATCH] `/symptom-records/:recordId/prediction/confirm` - 예측 결과 확정 마크

---

### 🥉 3순위 - 관리자 및 데이터 관리 기능
- [ ] [GET] `/admin/users` - 전체 사용자 목록 조회
- [ ] [POST] `/admin/bulk-upload` - 증상/질병 사전 일괄 등록 (엑셀)
- [ ] [GET] `/admin/predictions` - 전체 예측 내역 조회

---

### 🧪 AI 연동 준비
- [ ] [GET] `/model/status` - AI 모델 상태 확인
- [ ] [POST] `/model/predict` - 예측 모델 테스트 호출

